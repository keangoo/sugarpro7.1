
nv.models.funnelChart = function() {

  //============================================================
  // Public Variables with Default Settings
  //------------------------------------------------------------

  var funnel = nv.models.funnel()
    , yAxis = nv.models.axis()
    , legend = nv.models.legend()
    ;

  var margin = {top: 20, right: 10, bottom: 10, left: 10}
    , width = null
    , height = null
    , showLegend = true
    , showTitle = false
    , reduceXTicks = false // if false a tick will show for every data point
    , tooltip = null
    , tooltips = true
    , tooltipContent = function(key, x, y, e, graph) {
        return '<h3>' + key + " - " + x + '</h3>' +
               '<p>' +  y + '</p>';
      }
    , x //can be accessed via chart.xScale()
    , y //can be accessed via chart.yScale()
    , noData = "No Data Available."
    , dispatch = d3.dispatch('tooltipShow', 'tooltipHide', 'tooltipMove')
    ;

  //============================================================


  //============================================================
  // Private Variables
  //------------------------------------------------------------

  var showTooltip = function(e, offsetElement, properties) {
    var left = e.pos[0],
        top = e.pos[1],
        x = (e.point.y * 100 / properties.total).toFixed(1),
        y = ( yAxis ).tickFormat()( funnel.y()(e.point, e.pointIndex) ),
        content = tooltipContent(e.series.key, x, y, e, chart);
    tooltip = nv.tooltip.show([left, top], content, e.value < 0 ? 'n' : 's', null, offsetElement);
  };

  //============================================================


  function chart(selection) {

    selection.each(function(chartData) {

      var properties = chartData.properties
        , data = chartData.data;

      var container = d3.select(this),
          that = this;

      var availableWidth = (width  || parseInt(container.style('width'), 10) || 960)
                             - margin.left - margin.right,
          availableHeight = (height || parseInt(container.style('height'), 10) || 400)
                             - margin.top - margin.bottom;

      chart.update = function() { container.transition().duration(chart.delay()).call(chart); };
      chart.container = this;

      //------------------------------------------------------------
      // Display noData message if there's nothing to show.

      if (!data || !data.length || !data.filter(function(d) { return d.values.length }).length) {
        var noDataText = container.selectAll('.nv-noData').data([noData]);

        noDataText.enter().append('text')
          .attr('class', 'nvd3 nv-noData')
          .attr('dy', '-.7em')
          .style('text-anchor', 'middle');

        noDataText
          .attr('x', margin.left + availableWidth / 2)
          .attr('y', margin.top + availableHeight / 2)
          .text(function(d) { return d });

        return chart;
      } else {
        container.selectAll('.nv-noData').remove();
      }

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup Scales

      x = funnel.xScale();
      //y = funnel.yScale(); //see below

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup containers and skeleton of chart

      var wrap = container.selectAll('g.nv-wrap.nv-funnelWithLegend').data([data]);
      var gEnter = wrap.enter().append('g').attr('class', 'nvd3 nv-wrap nv-funnelWithLegend').append('g');
      var g = wrap.select('g');

      gEnter.append('g').attr('class', 'nv-y nv-axis');
      gEnter.append('g').attr('class', 'nv-funnelWrap');

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Title & Legend

      var titleHeight = 0
        , legendHeight = 0;

      if (showLegend)
      {
        gEnter.append('g').attr('class', 'nv-legendWrap');

        legend.width(availableWidth+margin.left);

        g.select('.nv-legendWrap')
            .datum(data)
            .call(legend);

        legendHeight = legend.height() + 10;

        if ( margin.top !== legendHeight + titleHeight ) {
          margin.top = legendHeight + titleHeight;
          availableHeight = (height || parseInt(container.style('height'), 10) || 400)
                             - margin.top - margin.bottom;
        }

        g.select('.nv-legendWrap')
            .attr('transform', 'translate(0,' + (-margin.top) +')');
      }

      if (showTitle && properties.title )
      {
        gEnter.append('g').attr('class', 'nv-titleWrap');

        g.select('.nv-title').remove();

        g.select('.nv-titleWrap')
          .append('text')
            .attr('class', 'nv-title')
            .attr('x', 0)
            .attr('y', 0 )
            .attr('text-anchor', 'start')
            .text(properties.title)
            .attr('stroke', 'none')
            .attr('fill', 'black')
          ;

        titleHeight = parseInt(g.select('.nv-title').node().getBBox().height, 10) +
          parseInt(g.select('.nv-title').style('margin-top'), 10) +
          parseInt(g.select('.nv-title').style('margin-bottom'), 10);

        if ( margin.top !== titleHeight + legendHeight )
        {
          margin.top = titleHeight + legendHeight;
          availableHeight = (height || parseInt(container.style('height'), 10) || 400)
                             - margin.top - margin.bottom;
        }

        g.select('.nv-titleWrap')
            .attr('transform', 'translate(0,' + ( -margin.top+parseInt(g.select('.nv-title').node().getBBox().height, 10) ) +')');
      }

      //------------------------------------------------------------


      //------------------------------------------------------------

      wrap.attr('transform', 'translate('+ margin.left +','+ margin.top + ')');


      //------------------------------------------------------------
      // Main Chart Component(s)

      funnel
        .width(availableWidth)
        .height(availableHeight)
        // .color(
        //   data.map( function(d,i) {
        //     return d.color || color(d, i);
        //   }).filter( function(d,i) { return !data[i].disabled } )
        // )
      ;


      var funnelWrap = g.select('.nv-funnelWrap')
          .datum( data.filter(function(d) { return !d.disabled; }) );

      funnelWrap.transition().duration(chart.delay()).call(funnel);

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup Scales (again, not sure why it has to be here and not above?)

      var series1 = [{x:0,y:0}];
      var series2 = data.filter(
          function(d) {
            return !d.disabled;
          }
        ).map(
          function(d) {
            return d.values.map(
              function(d,i) {
                return { x: d.x, y: d.y0+d.y };
              }
            );
          }
      );
      var tickData = d3.merge( series1.concat(series2) );

      // remap and flatten the data for use in calculating the scales' domains
      var minmax = d3.extent(tickData, function(d) { return d.y; });
      var aTicks = d3.merge(tickData).map(function(d) { return d.y; });

      y = d3.scale.linear().domain(minmax).range([availableHeight,0]);

      yScale = d3.scale.quantile()
                 .domain(aTicks)
                 .range(aTicks.map(function(d){ return y(d); }));

      //------------------------------------------------------------


      //------------------------------------------------------------
      // Setup Axes

      var w = availableHeight/1.1
        , r = ( ( (w/8) - w ) / 2 ) / availableHeight
        , c = availableWidth/2
        ;

      var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient('left')
            .tickSize( -availableWidth, 0)
            .tickValues(aTicks)
            .tickFormat( function(d,i) {
              return '';
            })
          ;

      g.select('.nv-y.nv-axis').transition().duration(chart.delay())
        .call(yAxis)
          .style('stroke-width', '1')
          .selectAll('line');

      //------------------------------------------------------------


      //============================================================
      // Event Handling/Dispatching (in chart's scope)
      //------------------------------------------------------------

      legend.dispatch.on('legendClick', function(d,i) {
        d.disabled = !d.disabled;

        if (!data.filter(function(d) { return !d.disabled; }).length) {
          data.map(function(d) {
            d.disabled = false;
            wrap.selectAll('.nv-series').classed('disabled', false);
            return d;
          });
        }

        container.transition().duration(chart.delay()).call(chart);
      });

      dispatch.on('tooltipShow', function(e) {
        if (tooltips) {
          showTooltip(e, that.parentNode, properties);
        }
      });

      //============================================================

    });

    return chart;
  }


  //============================================================
  // Event Handling/Dispatching (out of chart's scope)
  //------------------------------------------------------------

  funnel.dispatch.on('elementMouseover.tooltip', function(e) {
    dispatch.tooltipShow(e);
  });

  funnel.dispatch.on('elementMouseout.tooltip', function(e) {
    dispatch.tooltipHide(e);
  });
  dispatch.on('tooltipHide', function() {
    if (tooltips) {
      nv.tooltip.cleanup();
    }
  });

  funnel.dispatch.on('elementMousemove', function(e) {
    dispatch.tooltipMove(e);
  });
  dispatch.on('tooltipMove', function(e) {
    if (tooltip) {
      nv.tooltip.position(tooltip,e.pos);
    }
  });

  //============================================================


  //============================================================
  // Expose Public Variables
  //------------------------------------------------------------

  // expose chart's sub-components
  chart.dispatch = dispatch;
  chart.legend = legend;
  chart.funnel = funnel;
  chart.yAxis = yAxis;

  d3.rebind(chart, funnel, 'x', 'y', 'xDomain', 'yDomain', 'forceX', 'forceY', 'clipEdge', 'id', 'delay', 'fmtValueLabel', 'color', 'fill', 'classes', 'gradient');

  chart.colorData = function (_) {
    var colors = function (d,i) { return nv.utils.defaultColor()(d,i); },
        classes = function (d,i) { return 'nv-group nv-series-' + i; },
        type = arguments[0],
        params = arguments[1] || {};

    switch (type) {
      case 'graduated':
        var c1 = params.c1
          , c2 = params.c2
          , l = params.l;
        colors = function (d,i) { return d3.interpolateHsl( d3.rgb(c1), d3.rgb(c2) )(i/l); };
        break;
      case 'class':
        colors = function () { return 'inherit'; };
        classes = function (d,i) {
          var iClass = (i*(params.step || 1))%20;
          return 'nv-group nv-series-'+ i +' '+ ( d.classes || 'nv-fill' + (iClass>9?'':'0') + iClass );
        };
        break;
    }

    var fill = (!params.gradient) ? colors : function (d,i) {
      var p = {orientation: params.orientation || 'vertical', position: params.position || 'middle'};
      return funnel.gradient(d,i,p);
    };

    funnel.color(colors);
    funnel.fill(fill);
    funnel.classes(classes);

    legend.color(colors);
    legend.classes(classes);

    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return getX;
    getX = _;
    lines.x(_);
    funnelWrap.x(_);
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return getY;
    getY = _;
    lines.y(_);
    funnel.y(_);
    return chart;
  };

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.showLegend = function(_) {
    if (!arguments.length) return showLegend;
    showLegend = _;
    return chart;
  };

  chart.showTitle = function(_) {
    if (!arguments.length) return showTitle;
    showTitle = _;
    return chart;
  };

  chart.tooltip = function(_) {
    if (!arguments.length) return tooltip;
    tooltip = _;
    return chart;
  };

  chart.tooltips = function(_) {
    if (!arguments.length) return tooltips;
    tooltips = _;
    return chart;
  };

  chart.tooltipContent = function(_) {
    if (!arguments.length) return tooltipContent;
    tooltipContent = _;
    return chart;
  };

  chart.noData = function(_) {
    if (!arguments.length) return noData;
    noData = _;
    return chart;
  };

  chart.colorFill = function(_) {
    return chart;
  };

  //============================================================


  return chart;
}

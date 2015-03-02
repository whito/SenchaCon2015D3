Ext.define('d3m0.view.hierarchy.Sunburst', {
	extend: 'd3m0.view.hierarchy.Partition',
	xtype: 'sunburst',

	config: {
		childrenFn: function(d) {
			return d.childNodes;
		}
	},

		/**
		 * @method constructor
		 * @param  {Object} config Configuration
		 * @return {Object}
		 */
	constructor: function(config) {

		var layout = d3.layout.partition()
			.sort(null)
			.children(this.config.childrenFn)
			.value(function(d) {
				return d.childNodes.length + 1;
			});
		this.d3Layout = layout;

		return this.callParent(arguments);
	},

	start: function() {
		var childrenFn = this.getChildrenFn(),
			store = this.getDataStore();

		var s = this.getSize();
		this.size(s.width, s.height);

		this.initializing = false;
		if(store) {
			if(store.isLoaded()){this.draw();}
			store.on('load', function() {
				this.draw();
			}.bind(this));
		}
	},

	addNodes: function(selection) {
		var arc = this.arc,
			colors = this.colors,
			textFn = this.getTextFn();

		var group = selection.append("g")
			.attr("id", function(d) {
				return "sun-" + d.id;
			})
			.attr('class', 'node')
			.on('click', function(d) {
				if (!d.isOpen) {
					var parent = d;
					d.isOpen = true;
					while (parent = parent.parent) {
						parent.isOpen = true;
					}
					this.draw(d.isLeaf() ? d.parent : d);
				} else {
					if (!d.isRoot()) {
						d.isOpen = false;
						this.draw(d.parent);
					}
				}
			}.bind(this));

		group.append('path')
			.attr("id", function(d) {
				return "sun-path-" + d.id;
			})
			.attr("d", arc)
			.style("stroke", "#fff")
			.style("fill", function(d) {
				return colors(textFn(d));
			})
			.each(function(d) {
				d.partx0 = d.partx;
				d.partdx0 = d.partdx;
				d.party0 = d.party;
				d.partdy0 = d.partdy;
			});

		var text = group.append("text")
			.style("display", function(d) {
				return d.partdx > Math.PI / 2 ? "block" : "none";
			})
			.attr("x", 6)
			.attr("dy", 15);

		text.append("textPath")
			.attr("stroke", "black")
			.attr("stroke-width", "1")
			.attr("xlink:href", function(d) {
				return "#sun-path-" + d.id;
			})
			.text(function(d) {
				return d.data.name;
			});
	},

	updateNodes: function(selection) {
		var radius = this.radius;
		console.log(radius);
		selection.select('path')
			.transition()
			.attrTween("d", this.arcTween.bind(this));

		selection.select('text')
			.style("display", function(d) {
<<<<<<< HEAD
				return radius * d.partdx * (Math.PI) > 150 * Math.PI ? "block" : "none";
			})
	},
=======
				return d.partdx > 0.2 * Math.PI ? "block" : "none";
			});
	}
>>>>>>> Cleanup lint warnings
});

import * as d3 from "d3"
import { cumulative } from "shared/js/cumulative";


var selected = 'botanic-gardens'
var currentResults

Promise.all([
	d3.csv(`<%= path %>/botanic-gardens.csv`)
	])
	.then((results) =>  {
		cumulative(results[0], selected)
		currentResults = results[0]
		d3.select(".rainfall #loadingContainer").style("display","none")
	});

var to=null
var lastWidth = document.querySelector(`.rainfall #graphicContainer`).getBoundingClientRect()

window.addEventListener('resize', function() {
	var thisWidth = document.querySelector(`.rainfall #graphicContainer`).getBoundingClientRect()
	if (lastWidth != thisWidth) {
		window.clearTimeout(to);
		to = window.setTimeout(function() {
			    cumulative(currentResults, selected)
			}, 100)
	}

})	


var rainfall = [
{"id":"botanic-gardens", "text":"Botanic Gardens, Sydney", "notes":"Rainfall data from Botanic Gardens and Observatory Hill (Feb 24, 25),", "years":"1910 to 2021"},
{"id":"parramatta", "text":"Parramatta", "notes":"Rainfall data from Parramatta North (Masons Drive),", "years":"1965 to 2021"}
]

var selector = d3.select(".rainfall #rainSelector")

rainfall.forEach(function (d) {
		console.log("blah")
		selector.append("option")
			.attr("value",d.id)
			.text(d.text)	
})


selector.on("change", function() {
		d3.select(".rainfall #loadingContainer").style("display","block")
		selected = d3.select(this).property('value')
		var currentRiver = rainfall.find(d => d.id == selected)
		
		d3.select(".rainfall #yearsNote").text(currentRiver.years)
		d3.select(".rainfall #footnote").text(currentRiver.notes)

		console.log(selected)

		Promise.all([
		d3.csv(`<%= path %>/${selected}.csv`)
		])
		.then((results) =>  {
			d3.select(".rainfall #loadingContainer").style("display","none")
			cumulative(results[0], selected)
			currentResults = results[0]
		});

});
/* global $, _, crossfilter, d3  */



(function(nbviz,  _, $) {
    'use strict';

    queue()
        .defer(d3.json, "static/data/world-110m.json")
        .defer(d3.csv, "static/data/world-country-names-nobel.csv")
        // .defer(d3.json, "data/nobel_winners_cleaned.json")
        .defer(d3.json, "static/data/winning_country_data.json")
        .defer(d3.json, "static/data/nobel_winners_biopic.json")
        .await(ready);

    function ready(error, world, names, nationalData, winners) {
        // STORE OUR COUNTRY-DATA DATASET
        nbviz.data.nationalData = nationalData;
        // ADD OUR FILTER AND CREATE CATEGORY DIMENSIONS
        nbviz.filter = crossfilter(winners);
        nbviz.natDim = nbviz.filter.dimension(function(o){
            return o.country;
        });

        nbviz.catDim = nbviz.filter.dimension(function(o) {
            return o.category;
        });

        nbviz.genderDim = nbviz.filter.dimension(function(o) {
            return o.gender;
        });
        // INITIALIZE UI AND MAP
        nbviz.initUI();
        nbviz.initMap(world, names);
        // TRIGGER UPDATE FOR FULL WINNERS' DATASET
        // nbviz.filterByCountries([]);
        nbviz.onDataChange();
    }
}(window.nbviz = window.nbviz || {}));

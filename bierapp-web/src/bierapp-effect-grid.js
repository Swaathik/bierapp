/*
 * Copyright (c) 2014 Francisco Salavert (SGL-CIPF)
 * Copyright (c) 2014 Alejandro Alemán (SGL-CIPF)
 * Copyright (c) 2014 Ignacio Medina (EBI-EMBL)
 *
 * This file is part of JSorolla.
 *
 * JSorolla is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * JSorolla is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JSorolla. If not, see <http://www.gnu.org/licenses/>.
 */
function BierAppEffectGrid(args) {
    _.extend(this, Backbone.Events);
    this.id = Utils.genId("BierAppEffectGrid");

    this.target;
    this.autoRender = true;
    this.storeConfig = {};
    this.gridConfig = {};
    this.height = 500;

    _.extend(this, args);

    this.on(this.handlers);

    this.rendered = false;
    if (this.autoRender) {
        this.render();
    }

}

BierAppEffectGrid.prototype = {
    render: function () {
        var _this = this;

        //HTML skel
        this.div = document.createElement('div');
        this.div.setAttribute('id', this.id);

        this.panel = this._createPanel();

    },
    draw: function () {
        this.targetDiv = (this.target instanceof HTMLElement ) ? this.target : document.querySelector('#' + this.target);
        if (!this.targetDiv) {
            console.log('target not found');
            return;
        }
        this.targetDiv.appendChild(this.div);
        this.panel.render(this.div);
    },

    clear: function () {
        this.store.removeAll();
        this.freqStore.removeAll();
    },
    load: function (data) {

        var _this = this;

        var effects = _this._prepareEffectData(data);
        var freqs = _this._prepareFrequencyData(data.controls);

        _this.grid.setLoading(true);
        _this.clear();
        this.store.loadData(effects);
        this.freqStore.loadData(freqs);
        this.trigger("load:finish", {sender: _this})
        this.grid.setLoading(false);

    },
    _createPanel: function () {
        var _this = this;

        var storeArgs = {
            storeId: "EffectStore",
            groupField: 'featureId',
            pageSize: 10,
            fields: [
                {name: "featureId", type: "string" },
                {name: "featureName", type: "string" },
                {name: "featureType", type: "string" },
                {name: "featureBiotype", type: "string" },
                {name: "featureChromosome", type: "string" },
                {name: "featureStart", type: "int"    },
                {name: "featureEnd", type: "int"    },
                {name: "featureStrand", type: "string" },
                {name: "snpId", type: "string" },
                {name: "ancestral", type: "string" },
                {name: "alternative", type: "string" },
                {name: "geneId", type: "string" },
                {name: "transcriptId", type: "string" },
                {name: "geneName", type: "string" },
                {name: "consequenceType", type: "string" },
                {name: "consequenceTypeObo", type: "string" },
                {name: "consequenceTypeDesc", type: "string" },
                {name: "consequenceTypeType", type: "string" },
                {name: "aaPosition", type: "int"    },
                {name: "aminoacidChange", type: "string" },
                {name: "codonChange", type: "string" },
                {name: "polyphenScore", type: "number"  },
                {name: "polyphenEfect", type: "number"  },
                {name: "siftScore", type: "number"  },
                {name: "siftEffect", type: "number"  },

            ],
            data: [],
            autoLoad: false,
            proxy: {type: 'memory'}
        }

        _.extend(storeArgs, this.storeConfig);

        this.store = Ext.create("Ext.data.Store", storeArgs);


        var gridArgs = {
            store: this.store,
            loadMask: true,
            border: false,
            //height: this.height,
            height: 200,
            viewConfig: {
                emptyText: 'No records to display',
                enableTextSelection: true
            },
            plugins: ["bufferedrenderer"],
            columns: [
                {xtype: 'rownumberer'},
                {
                    text: "Position chr:start:end (strand)",
                    dataIndex: "featureChromosome",
                    xtype: "templatecolumn",
                    tpl: '{featureChromosome}:{featureStart}-{featureEnd} <tpl if="featureStrand == 1">(+)<tpl elseif="featureStrand == -1">(-)</tpl>',
                    flex: 1
                },
                {
                    text: "SNP Id",
                    dataIndex: "snpId",
                    flex: 1
                },
                {
                    text: "Conseq. Type",
                    dataIndex: "consequenceTypeObo",
                    xtype: "templatecolumn",
                    tpl: '{consequenceTypeObo} (<a href="http://www.sequenceontology.org/browser/current_svn/term/{consequenceType}" target="_blank">{consequenceType}</a>)',
                    flex: 1
                },
                {
                    text: "Aminoacid Change",
                    xtype: "templatecolumn",
                    tpl: '<tpl if="aminoacidChange">{aminoacidChange} - {codonChange} ({aaPosition}) <tpl else>.</tpl>  ',
                    flex: 1
                },
                {
                    text: "Gene (EnsemblId)",
                    dataIndex: "geneName",
                    xtype: 'templatecolumn',
                    tpl: '<tpl if="geneName">{geneName} (<a href="http://www.ensembl.org/Homo_sapiens/Location/View?g={geneId}" target="_blank">{geneId}</a>)<tpl else>.</tpl>',
                    flex: 1
                },
                {
                    text: "Transcript Id",
                    dataIndex: "transcriptId",
                    xtype: 'templatecolumn',
                    tpl: '<a href="http://www.ensembl.org/Homo_sapiens/Location/View?t={transcriptId}" target="_blank">{transcriptId}</a>',
                    flex: 1
                },
                {
                    text: "Feature Id",
                    dataIndex: "featureId",
                    flex: 1

                },
                {
                    text: "Feature Name",
                    dataIndex: "featureName",
                    flex: 1

                },
                {
                    text: "Feature Type",
                    dataIndex: "featureType",
                    flex: 1

                },
                {
                    text: "Feature Biotype",
                    dataIndex: "featureBiotype",
                    flex: 1

                },
                {
                    text: "Ancestral",
                    dataIndex: "ancestral",
                    hidden: true,
                    flex: 1
                },
                {
                    text: "Alternative",
                    dataIndex: "alternative",
                    hidden: true,
                    flex: 1
                }

            ],
            viewConfig: {
                emptyText: 'No records to display'
            }
        }

        _.extend(gridArgs, this.gridConfig);

        this.grid = Ext.create('Ext.grid.Panel', gridArgs);

        this.freqStore = Ext.create('Ext.data.Store', {
            fields: ['maf', 'name'],
            autoLoad: false
        });
        var freqChart = Ext.create('Ext.chart.Chart', {
                    xtype: 'chart',
                    width: 100,
                    height: 200,
                    store: this.freqStore,
                    animate: true,
                    shadow: true,
                    margin: 10,
                    legend: {
                        position: 'right'
                    },
                    theme: 'Base:gradients',
                    axes: [
                        {
                            type: 'numeric',
                            position: 'bottom',
                            fields: ['maf'],
                            titleMargin: 20,
                            title: 'Minimum Allele Frequency',
                            minimum: 0,
                            maximum: 1
                        },
                        {
                            type: 'category',
                            position: 'left',
                            fields: ['name'],
                            title: 'Populations'
                        }
                    ],
                    series: [
                        {
                            type: 'bar',
                            axis: 'bottom',
                            xField: 'name',
                            yField: 'maf',
                            highlight: {
                                strokeStyle: 'black',
                                fillStyle: '#c1e30d',
                                lineDash: [5, 3]
                            },
                            label: {
                                field: 'maf',
                                display: 'insideEnd',
                                renderer: function (value) {
                                    return value.toFixed(3);
                                }
                            }
                        }
                    ]
                }
            )
            ;

        var panel = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            overflowY: true,
            padding: 10,
            items: [
                {
                    xtype: 'box',
                    cls: 'ocb-header-4',
                    html: 'Effects',
                    margin: '5 0 10 10'
                },
                this.grid,
                {
                    xtype: 'box',
                    cls: 'ocb-header-4',
                    html: 'Population Frequencies',
                    margin: '20 0 10 10'
                },
                freqChart
            ],
            height: this.height
        });
        return panel;


    },
    _prepareEffectData: function (data) {
        var _this = this;

        var req = data.chromosome + ":" + data.position + ":" + data.ref + ":" + data.alt;
        var finalData = [];
        var url = "http://ws.bioinfo.cipf.es/cellbase/rest/latest/hsa/genomic/variant/" + req + "/consequence_type?of=json";
        $.ajax({
            url: url,
            dataType: 'json',
            async: false,
            success: function (response, textStatus, jqXHR) {
                if (response.length > 0) {
                    finalData = _this._filterEffectData(response);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('Error loading Effect');
            }
        });


        return finalData;
    },

    _filterEffectData: function (data) {
        var _this = this;
        var res = [];

        var regulatory = {};

        for (var i = 0; i < data.length; i++) {
            var elem = data[i];
            if (elem.consequenceTypeObo == "coding_sequence_variant" || elem.consequenceTypeObo == "exon_variant" || elem.consequenceTypeObo == "intron_variant") {
                continue;
            } else if (elem.consequenceTypeObo == "regulatory_region_variant") {
                if (!(elem.featureId in regulatory)) {
                    regulatory[elem.featureId] = elem;
                }
                continue;
            }
            res.push(elem);
        }

        for (var elem in regulatory) {
            res.push(regulatory[elem]);
        }
        return res;
    },
    _prepareFrequencyData: function (data) {

        var finalData = [];

        for (var key in data) {
            finalData.push({
                name: key,
                maf: data[key].maf
            })
        }

        return finalData;
    }
}



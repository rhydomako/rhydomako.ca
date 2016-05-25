#inspired by http://bost.ocks.org/mike/make/

DATA_DIR=data

all: $(DATA_DIR)/network.json $(DATA_DIR)/network.json ## Root build target

$(DATA_DIR)/singlelinestreetnetwork_shp.zip: ## Grab raw shapefile archive from Region of Peel Open Data
	curl -o $@ 'http://opendata.peelregion.ca/media/2585/singlelinestreetnetwork_shp.zip' 

$(DATA_DIR)/slsn.shp: $(DATA_DIR)/singlelinestreetnetwork_shp.zip  ## Unzip shapefile archive
	unzip $< -d $(DATA_DIR)
	touch $@

$(DATA_DIR)/slsn_wgs84.shp: $(DATA_DIR)/slsn.shp ## projection conversion
	ogr2ogr -f "ESRI Shapefile" $@ $< -t_srs EPSG:4326

$(DATA_DIR)/network.json $(DATA_DIR)/network_edges.json: ## process the shapefile into network
	python make_network.py

$(DATA_DIR)/slsn.geojson: $(DATA_DIR)/slsn.shp ## Convert the shapefile to GeoJSON file (requires ogr2ogr from the GDAL packages)
	ogr2ogr -f GeoJSON -t_srs crs:84 $@ $<

$(DATA_DIR)/slsn.topojson: $(DATA_DIR)/slsn.geojson ## Convert the GeoJSON to TopoJSON while downsampling (requires topojson)
	topojson \
		-o $@ \
		-- $<

.PHONY: help clean all

clean: ## Clear out any data files
	rm -rf $(DATA_DIR)/*

#inspired by http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## Display all Makefile targets
	@awk -F ':|##' \
		'/^[^\t].+?:.*?##/ {\
			printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF \
		}' $(MAKEFILE_LIST)

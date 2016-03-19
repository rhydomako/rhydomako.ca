DATA_DIR=data

all: $(DATA_DIR)/electoral_districts.topojson ## Root build target

$(DATA_DIR)/gfed000b11a_e.zip: ## Grab election district files from StatCan
	curl -o $@ 'http://www12.statcan.gc.ca/census-recensement/2011/geo/bound-limit/files-fichiers/gfed000b11a_e.zip'

$(DATA_DIR)/gfed000b11a_e.shp: $(DATA_DIR)/gfed000b11a_e.zip ## unzip archive containing shapefiles
	unzip $< -d $(DATA_DIR)
	touch $@

$(DATA_DIR)/electoral_districts.geojson: $(DATA_DIR)/gfed000b11a_e.shp ## Convert election district shapefiles to GeoJSON files
	ogr2ogr --config SHAPE_ENCODING "ISO-8859-1" -f GeoJSON $@ $<

$(DATA_DIR)/electoral_districts.topojson: $(DATA_DIR)/electoral_districts.geojson ## Convert GeoJSON boundries to TopoJSON files
	topojson \
	 --id-property FEDUID \
	 -q 1e5 \
	 --simplify-proportion 0.03 \
	 -p \
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

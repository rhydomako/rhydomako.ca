
DATA_DIR=data


all: $(DATA_DIR)/neighborhoods.topojson ## Root target

$(DATA_DIR)/neighbourhoods_planning_areas_wgs84.zip: ## Grab neighborhood shapefiles from Open Data Toronto
	curl -o $@ 'http://opendata.toronto.ca/gcc/neighbourhoods_planning_areas_wgs84.zip'

$(DATA_DIR)/NEIGHBORHOODS_WGS84.shp: $(DATA_DIR)/neighbourhoods_planning_areas_wgs84.zip ## unzip archive containing shapefiles
	unzip $< -d $(DATA_DIR)
	touch $@

$(DATA_DIR)/neighborhoods.geojson: $(DATA_DIR)/NEIGHBORHOODS_WGS84.shp ## Extract the neighborhood polylines
	ogr2ogr -f GeoJSON -dialect sqlite -sql "SELECT TRIM(SUBSTR(AREA_NAME,0,LENGTH(AREA_NAME)-4)) as Neighbourhood, * FROM NEIGHBORHOODS_WGS84" $@ $<

$(DATA_DIR)/neighborhoods.topojson: $(DATA_DIR)/neighborhoods.geojson ## Convert the GeoJSON to TopoJSON file
	topojson \
	 --id-property AREA_S_CD \
	 -q 1e5 \
	 --simplify-proportion 0.05 \
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

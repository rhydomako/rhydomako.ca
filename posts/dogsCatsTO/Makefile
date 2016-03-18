#inspired by http://bost.ocks.org/mike/make/

DATA_DIR=data

all: $(DATA_DIR)/fsas.topojson ## Root build target

$(DATA_DIR)/2013_licenses.xls: ## Grab raw Licensed Dogs and Cats Reports from Open Data TO
	curl -o $@ 'http://www1.toronto.ca/City%20Of%20Toronto/Information%20&%20Technology/Open%20Data/Data%20Sets/Assets/Files/2013%20licences%20sold%20by%20fsa.xls'

$(DATA_DIR)/2013_licenses.csv: $(DATA_DIR)/2013_licenses.xls ## Convert Dog and Cats Reports to CSV
	python convert_xls.py $<

$(DATA_DIR)/gfsa000a11a_e.zip: ## Grab raw shapefile archive from StatsCan
	curl -o $@ 'http://www12.statcan.gc.ca/census-recensement/2011/geo/bound-limit/files-fichiers/gfsa000a11a_e.zip'

$(DATA_DIR)/gfsa000a11a_e.shp: $(DATA_DIR)/gfsa000a11a_e.zip  ## Unzip shapefile archive
	unzip $< -d $(DATA_DIR)
	touch $@

$(DATA_DIR)/population.csv: ## Grab population data per FSA from census
	curl -J "http://www12.statcan.gc.ca/census-recensement/2011/dp-pd/hlt-fst/pd-pl/FullFile.cfm?T=1201&LANG=Eng&OFT=CSV&OFN=98-310-XWE2011002-1201.CSV" | grep "^M" > $(DATA_DIR)/tmp
	{ echo "CFSAUID,dummy1,Population,dummy2,dummy3"; cat $(DATA_DIR)/tmp; } > $@

# Including:
# CFSAUID -- FSA id
#
# Ignoring:
# PRUID -- Province id
# PRNAME -- Province name
$(DATA_DIR)/fsas.geojson: $(DATA_DIR)/gfsa000a11a_e.shp ## Convert the shapefile to GeoJSON file (requires ogr2ogr from the GDAL packages)
	ogr2ogr -f GeoJSON -where "CFSAUID LIKE 'M%'" $@ $<

$(DATA_DIR)/fsas.topojson: $(DATA_DIR)/fsas.geojson $(DATA_DIR)/2013_licenses.csv $(DATA_DIR)/population.csv ## Convert the GeoJSON to TopoJSON while downsampling (requires topojson)
	topojson \
		-e $(DATA_DIR)/2013_licenses.csv \
		-e $(DATA_DIR)/population.csv \
		--id-property CFSAUID,index \
		-p +DOG \
		-p +CAT \
		-p +Total \
		-p +cat_pct \
		-p +dog_pct \
		-p +Population \
		-q 1e5 \
		--simplify-proportion 0.1 \
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

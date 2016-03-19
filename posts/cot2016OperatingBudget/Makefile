#inspired by http://bost.ocks.org/mike/make/

DATA_DIR=data

all: $(DATA_DIR)/2016_Recommend.csv ## Root build target

$(DATA_DIR)/2016_Recommend.xlsx: ## Grab raw Preliminary Operating Budget Summary 2016
	curl -o $@ 'http://www1.toronto.ca/City%20Of%20Toronto/Information%20&%20Technology/Open%20Data/Data%20Sets/Assets/Files/2016_Recommend.xlsx'

$(DATA_DIR)/2016_Recommend.csv: $(DATA_DIR)/2016_Recommend.xlsx ## Convert Preliminary Operating Budget Summary 2016 to CSV
	python convert_xls.py $<

.PHONY: help clean all

clean: ## Clear out any data files
	rm -rf $(DATA_DIR)/*

#inspired by http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## Display all Makefile targets
	@awk -F ':|##' \
		'/^[^\t].+?:.*?##/ {\
			printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF \
		}' $(MAKEFILE_LIST)

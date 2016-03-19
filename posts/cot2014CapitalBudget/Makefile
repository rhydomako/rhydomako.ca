#inspired by http://bost.ocks.org/mike/make/

DATA_DIR=data

all: $(DATA_DIR)/capital_2014.tsv ## Root build target

$(DATA_DIR)/capital_2014.xlsx: ## Grab raw Capital Budget & Plan By Ward 2014
	curl -o $@ 'http://www1.toronto.ca/City%20Of%20Toronto/Information%20&%20Technology/Open%20Data/Data%20Sets/Assets/Files/2014%20Council%20Approved%20Projects%20By%20Ward.xlsx'

$(DATA_DIR)/capital_2014.tsv: $(DATA_DIR)/capital_2014.xlsx ## Convert Capital Budget & Plan By Ward 2014 to CSV
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

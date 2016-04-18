#inspired by http://bost.ocks.org/mike/make/

DATA_DIR=data

all: $(DATA_DIR)/subjects_isomap.json ## Root build target

$(DATA_DIR)/tpl.json.xz: ## Grab compressed tpl catalogue JSON file
	curl -o $@ 'http://data.flamy.ca/tpl.json.xz'

$(DATA_DIR)/tpl.json: $(DATA_DIR)/tpl.json.xz  ## Unzip JSON file
	unxz $<
	touch $@

$(DATA_DIR)/subjects_isomap.json: $(DATA_DIR)/tpl.json
	python process_data.py

.PHONY: help clean all

clean: ## Clear out any data files
	rm -rf $(DATA_DIR)/*

#inspired by http://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
help: ## Display all Makefile targets
	@awk -F ':|##' \
		'/^[^\t].+?:.*?##/ {\
			printf "\033[36m%-30s\033[0m %s\n", $$1, $$NF \
		}' $(MAKEFILE_LIST)

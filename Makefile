
data/zip/townssurvey_shp.zip:
	mkdir -p $(dir $@)
	wget -O $@ http://download.massgis.digital.mass.gov/shapefiles/state/townssurvey_shp.zip
	touch $@

data/shp/TOWNSSURVEY_POLYM.shp: data/zip/townssurvey_shp.zip
	mkdir -p $(dir $@)
	unzip -d $(dir $@) $<
	touch $@

data/json/TOWNSSURVEY_POLYM.json: data/shp/TOWNSSURVEY_POLYM.shp
	mkdir -p $(dir $@)
	ogr2ogr -f "GeoJSON" -t_srs EPSG:4326 -sql "SELECT TOWN as name, TOWN_ID as id FROM TOWNSSURVEY_POLYM" $@ $<

public/data/towns.json: data/json/TOWNSSURVEY_POLYM.json
	mkdir -p $(dir $@)
	npx geo2topo -o $@ towns=$<

.PHONY: data clean
data: public/data/towns.json

clean:
	rm -rf public/data
	rm -rf data

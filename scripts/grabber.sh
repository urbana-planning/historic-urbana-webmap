
# get urls from all modals
# need to move jpgs to historic_img/large/ with wget
#grep -hio 'http://urbanaillinois.*[.jpe?g]' ../modals/* > jpgs.txt
#wget -i jpgs.txt

grep -hio 'http://urbanaillinois.*[.jpe?g]' ../historic_places.csv > jpgs.txt


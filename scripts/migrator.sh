#!/bin/bash
$OLD_URL=http://urbanaillinois.us/sites/default/files/imagecache/large/images/
$NEW_URL=historic_img/large/

find ../modals -type f -print0 | xargs -0 sed -i 's#$OLD_URL#$NEW_URL#g'

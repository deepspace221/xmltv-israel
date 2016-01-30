#/bin/sh
configdir=/var/tuxbox/config/dbepg
configfile=$configdir/e1_Israel.cfg
epg=/var/lib/sqlite/epg.db
convert=/var/bin/db_epg
genrefile=$configdir/genre.dat
datadir=/mnt/var
dataname=yy
downloadname=$dataname.gz

# Some default values, to make sure they are set..
hours=72
timeOffset=0
numofdays=3


OIFS=$IFS
IFS='='
while read opt val
do
	case "$opt" in
	"timeOffset") 
		timeOffset=$val ;
		;;
	"numOfDays") 
		numofdays=$(($val)) 
		hours=$((24*($val))) ;
		;;
	"mapfile")
		mapfile=$configdir/$val ;
		;;
	"genreMap")
		genrefile=$configdir/$val ;
		;;
		
	"epgLocation")
		epg=$val ;
		datadir=`dirname $val` ;
		;;
	esac;
done < $configfile
IFS=$OIFS

echo Using a timeOffset of $timeOffset seconds.
echo Retrieving $hours hours of data for each channel
touch $mapfile

if [ -f $epg ] && [ -f $convert ] && [ -f $mapfile ]; then
	current=0
		tmp=`awk "BEGIN { format = \"%Y%m%d\"; print strftime(format, systime()+$((3600*24*$current))) }"`
		echo Date: $tmp
#		wget  "http://www.rytec.be/epg/$downloadname" -O $datadir/$downloadname
#		wget  "http://www.xmltvepg.be/$downloadname" -O $datadir/$downloadname
#		wget  "http://rytecepg.ipservers.eu/epg_data/osn_jsc/$downloadname" -O $datadir/$downloadname
#		gunzip $datadir/$downloadname
		if [ -f $datadir/$dataname ]; then
			echo "$convert -t xmltv -d $epg -f $datadir/$dataname -o $timeOffset -h $hours -m $mapfile -g $genrefile -e -c 8"
			$convert -t xmltv -d $epg -f $datadir/$dataname -o $timeOffset -h $hours -m $mapfile -g $genrefile -e -c 8
			rm $datadir/$dataname
		else
			echo "Data $datadir/$dataname not found"
		fi
else
	if [ ! -f $epg ]; then echo "Database not found" ; fi;
	if [ ! -f $convert ]; then echo "Converter $convert not found" ; fi;
	if [ ! -f $mapfile ]; then echo "Mapfile $mapfile not found" ; fi;
fi;






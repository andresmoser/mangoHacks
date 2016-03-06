// JavaScript source code
var client_id = 'c0f7afc3520542959e587d2249cda4e1'; // Your client id for spotify
var client_secret = '8f15c046151345d88cb373847dece382'; // Your client secret or spotify
var echo_nest = 'http://developer.echonest.com/api/v4/';
var echo_api_id = 'G92VW09ZBNGLUVN8C';
var datas = [];
var clarifaiTagsArray=[];
var tempo = 0, tempoMax = 0, danceability = 0, energy = 0, acousticness = 0, loudness = 0, liveness = 0, song_hotness = 0, mood2 = 'happy', sortType = "artist_familiarity-desc";

function buildClarifaiArray(list){
	clarifaiTagsArray = [];
	clarifaiTagsArray = list.slice(0);
	console.log(clarifaiTagsArray);

}
function getEchonestTags() {
    console.log("Opening EchonestTags");
    var url = echo_nest + 'song/search';
    console.log(clarifaiTagsArray);
    $.ajaxSetup({ traditional: true });
    $.getJSON(url, { 'format':'json',
        api_key: echo_api_id,
        min_tempo:tempo.toString(),
        //max_tempo: tempoMax.toString(),
        min_danceability: danceability.toString(),
        min_energy: energy.toString(),
       min_acousticness: acousticness.toString(),
       // min_loudness: loudness.toString(),
       min_liveness: liveness.toString(),
        sort:sortType,
        mood:mood2,

        results: '30',
    bucket: ['id:spotify','tracks'], // this must stay the same
    },
    function (data) {
        console.log("%s\n", url);
        console.log(data);
        numOfSongs = data.response.songs.length;
        var i;
        for (i = 0; i < numOfSongs-1; i++) {
            if (data.response.songs[i].tracks[0] != null) {
                var myJSONObject = data.response.songs[i].tracks[0].foreign_id;
                songID = myJSONObject.split(":");

                console.log(songID[2]);
               // datas.push(songID[2]);
				
                var spotifyCheckURL = "https://api.spotify.com/v1/tracks/" + songID[2] + "?market=US";


                
                $.getJSON(spotifyCheckURL,
                    function (data2) {

                        if (data2.is_playable == true) {
                            console.log(data2.id);
                            datas.push(data2.id);
                            console.log("%s", datas.length);
                        }
                    }).done(function () {
                       // spotifyPlaylist();
                    })



                console.log("got out of the 2nd jquery");
            }
            console.log("%s\n",i);
        }
        console.log("got out of loop\n");
	//	spotifyPlaylist();
    }).done(function () {
        //spotifyPlaylist();
    });
    console.log("I got here, out of the functions\n");
    // var myFunction = setTimeout(spotifyPlaylist, 2000);
};

function spotifyPlaylist() {
    /*
    var echonestBegin = getEchonestTags();
    console.log("we manage to get passed echonest method");
    if (echonestBegin == null) {
        console.log("problem calling echonest");
    }
    */
        var playlistLink = "https://embed.spotify.com/?uri=spotify:trackset:PREFEREDTITLE:"
        console.log("%s\n", datas.length);
        for (var i = 0; i < datas.length - 1; i++) {
            playlistLink += datas[i];
            if (i < datas.length - 2) {
                playlistLink += ','
            }
        }
        console.log(playlistLink);
        var spotifyPlaylist = document.createElement('iframe');
        spotifyPlaylist.allowtransparency = "true";
        spotifyPlaylist.frameBorder = "0";
        spotifyPlaylist.src = playlistLink;

        var playLabel = document.getElementById('playSongs');
        playLabel.appendChild(spotifyPlaylist);
    
		//clarifaiTagsArray = primaryTags;
}

function functionTimer() {
    getEchonestTags();
    setTimeout(spotifyPlaylist,4000);
}

function createAlgorithm() {
    var library = "books book library university school";
    var partyScene = "party club dancing nightlife";
    var gymScene = "weight gym weight exercise";
    var rockScene = "black hair color unnatural ";
    var numOfTags = clarifaiTagsArray.length;
    var deviations = ((Math.random() * 5) + 1);
    for (var i = 0; i < numOfTags - 1; i++) {
        var bob = "library";
        var k = library.indexOf(bob);
        if (k >= 0) {
            //console.log("This works");
        }
        console.log(clarifaiTagsArray[i] + "\n");
        if (partyScene.indexOf(clarifaiTagsArray[i]) > -1) {
            console.log("found party scene");
            deviations = Math.random();

            danceability += deviations*0.07;
            energy += deviations;
            loudness += 10 + (deviations * 10 + 1);
            tempo += deviations * 20;
            mood2 = "exciting";
            sortType = "danceability-desc";

        } else if (gymScene.indexOf(clarifaiTagsArray[i]) > -1) {
            console.log("found gym scene");
            deviations = Math.random();

            energy += deviations * 0.07;
            song_hotness += deviations * 0.07;
            loudness += 10 + (deviations * 10 + 1);
            tempo += deviations * 20;
            mood2 = "exciting";


        } else if (library.indexOf(clarifaiTagsArray[i]) > -1) {
            console.log("found library scene");
            deviations = Math.random();
            console.log(deviations + "\n");
            acousticness += deviations*.8 ;


        } else if (rockScene.indexOf(clarifaiTagsArray[i]) > -1) {
            deviations = Math.random();


        } else if (clarifaiTagsArray[i].toString().indexOf("indoors") > -1) {

            deviations = Math.random();
            tempo += deviations * 10;

        } else if (clarifaiTagsArray[i].toString().indexOf("outdoors") > -1) {
            deviations = Math.random();
            if (tempo > 0) { }
            else {
                tempoMax += deviations*20;
            }
        }
    }
    console.log(tempo.toString() + " " + tempoMax.toString() + " " + danceability.toString() + " " + energy.toString() + " " + acousticness.toString() + " " + loudness.toString() + " " + liveness.toString());
    functionTimer();
}
$(document).ready(function(){

	var canPlay = true,
			contents,
			currentCount = 0,
			identifier,
			linkCounter = 0,
			myJuke,
			player = $("#musicPlayer").get(0),
			songCounter = 0;

	function Song(artist, songName, site) {
	  this.artist = artist;
	  this.songName = songName;
	  this.site = site;
	}

	function Jukebox(songs = {}) {
	  this.songs = songs;
	  this.addSong = function(newSong) {
	    songs[Object.keys(songs).length] = newSong;
	  }
	}

	//Creates myJuke variable, which is a Jukebox object.
	function defaultSetup() {
		var songA = new Song("Sia", "Cheap Thrills", "https://archive.org/download/SiaCheapThrillsVideo/Sia%20-%20Cheap%20Thrills%20(Video).mp3"),
				songB = new Song("Drake", "One Dance", "https://archive.org/download/onedance_drake/12.%20One%20Dance%20(Ft.%20Wizkid%20&%20Kyla).mp3"),
				songC = new Song("Calvin Harris ft. Rihanna", "This Is What You Came For", "https://archive.org/download/01ThisIsWhatYouCameForfeat.RihannaSingle/01%20This%20Is%20What%20You%20Came%20For%20(feat.%20Rihanna)%20-%20Single.mp3"),
				songD = new Song("Justin Timberlake", "Can't Stop The Feeling", "https://archive.org/download/JustinTimberlakeCantStopTheFeelingLyricsVideo/Justin%20Timberlake%20-%20Can't%20Stop%20the%20Feeling%20(%20Lyrics%20Video%20).mp3"),
				songE = new Song("The Chainsmokers", "Don't Let Me Down", "https://archive.org/download/TheChainsmokersDontLetMeDownFt.Daya/The%20Chainsmokers%20-%20Don't%20Let%20Me%20Down%20ft.%20Daya.mp3"),
				songF = new Song("Adele", "Send My Love", "https://archive.org/download/Moon_Yoon_Hee_pop_570/Adele-SendMyLovetoYourNewLover.mp3"),
				songG = new Song("Twenty One Pilots","Stressed Out","https://archive.org/download/Twenty-one-pilots-Stressed-Out-OFFICIAL-VIDEO/twenty-one-pilots-Stressed-Out-[OFFICIAL-VIDEO].mp3"),
				songH = new Song("Lukas Graham","7 Years","https://archive.org/download/LukasGraham7YearsOFFICIALMUSICVIDEO/Lukas%20Graham%20-%20%207%20Years%20[OFFICIAL%20MUSIC%20VIDEO].mp3");

		myJuke = new Jukebox();
		myJuke.addSong(songA);
		myJuke.addSong(songB);
		myJuke.addSong(songC);
		myJuke.addSong(songD);
		myJuke.addSong(songE);
		myJuke.addSong(songF);
		myJuke.addSong(songG);
		myJuke.addSong(songH);
	}

	if (Cookies.get("playlist") === undefined) {
		defaultSetup()
		} else {
				var holder = JSON.parse(Cookies.get("playlist"));
				if (! Object.keys(holder.songs).length > 0){
					$(".add-inst").css("display", "block");
					myJuke = new Jukebox();
				} else {
					myJuke = new Jukebox();
					for(var i = 0; i < Object.keys(holder.songs).length; i++){
						myJuke.songs[i] = holder.songs[Object.keys(holder.songs)[i]]
					}					
				}
	}


	//Add songs in myJuke.songs to all-tracks div on the right hand side of the page. Adds a double-click listener to each song
	//to play the selected song and a button to remove individual songs.
	function allTracksInitializer(){
		if (Object.keys(myJuke.songs).length === 0) {
			$(".add-inst").css("display", "block");
		} else {
				$(".add-inst").css("display", "none");
				for (var i=0; i< Object.keys(myJuke.songs).length; i++){
					$("#all-tracks").append("<li class='allsongs " + i + "'>" + myJuke.songs[i].artist + "-" + myJuke.songs[i].songName + "</li>")
					$("#x-wrapper-2").append("<i class='fa fa-times remove-song' id='s"+ songCounter + "' aria-hidden='true'></i>");
					$("#s" + songCounter).click(function(e){
						var songId = $(e.currentTarget).attr("id")
						$("#all-tracks li:eq(" + songId.slice(1, songId.length) + ")").remove();
						$("#x-wrapper-2 i:eq(" + ($('#x-wrapper-2 i').length - 1) + ")").remove();
						delete myJuke.songs[Object.keys(myJuke.songs)[songId.slice(1, songId.length)]]
						setTimeout(function(){
							Cookies.set("playlist", JSON.stringify(myJuke));
						}, 300);
						
						songCounter -= 1;
						if (songCounter === 0) {
							$(".add-inst").css("display", "block");
						}
					})
					songCounter +=1;
					$( "#all-tracks li:contains(" +  myJuke.songs[i].songName + ")" ).dblclick(function(e){
						stopMusic();
						$("#musicPlayer").attr("src",  myJuke.songs[parseInt($(e.currentTarget).attr("class").split(" ")[1])].site)
						currentCount = 0
						setTimeout(function() {
							player.play()
						}, 150);
						$("#musicPlayer").on("ended", function(){
							$("#music-playing").css("display", "none")
							$("#no-music").css("display", "block")
						})
					})
				}
			}
	}

	//Fires allTracksInitializer on page load.
	allTracksInitializer();

	//Function to add interactive options to songs, allowing for dragging and dropping to playlist on the left hand side. Also enables sorting.
	function addInteraction() {
		$(".allsongs").draggable({containment: "document", cursor: "pointer", helper: "clone", revert: true, opacity: 0.60, start: function(){
			contents = $(this).text();
			identifier = $(this).attr("class").split(" ")[1];
		}});

		$("#plist").droppable({accept: ".allsongs", tolerance: "pointer", cursor: "pointer", revert: true, opacity: 0.60, drop: function(){
			$("#plist").append("<li class='plistsongs p" + identifier + "'>" + contents + "</li>");
			$("#x-wrapper").append("<i class='fa fa-times remove-song' id='"+ linkCounter + "' aria-hidden='true'></i>");
			$("#" + linkCounter).click(function(e){
				$("#plist li:eq(" + $(e.currentTarget).attr("id") + ")").remove();
				$("#x-wrapper i:eq(" + ($('#x-wrapper i').length - 1) + ")").remove();
				linkCounter -= 1;
				if (linkCounter === 0) {
					$(".drag-inst").css("display", "block");
				}
			})
			linkCounter +=1;
				$(".p" + identifier).dblclick(function(e){
					stopMusic();
					currentCount = parseInt($("#plist li").index(e.currentTarget))
					playMusic();
			})
		}});
		$("#plist").sortable({containment: "document", tolerance: "pointer", cursor: "pointer", revert: true, opacity: 0.60});
	}

	//Fires addInteraction on page load.
	addInteraction();

	//Function adds a new song to the myJuke.songs object. Adds appropriate drag/double click functionality.

	function addNewSong() {
		myJuke.songs[Object.keys(myJuke.songs).length] = {artist: $("#artistname").val(), songName: $("#songname").val(), site: $("#urlname").val()};
		Cookies.set("playlist", JSON.stringify(myJuke));
		$("#all-tracks").prepend("<li class='allsongs " + (Object.keys(myJuke.songs).length - 1) + "'>" + $('#artistname').val() + "-" + $('#songname').val() + "</li>");
		$(".add-inst").css("display", "none");
		$("#x-wrapper-2").append("<i class='fa fa-times remove-song' id='s"+ songCounter + "'' aria-hidden='true'></i>");
		$("#s" + songCounter).click(function(e){
			var songId = $(e.currentTarget).attr("id")
			$("#all-tracks li:eq(" + songId.slice(1, songId.length) + ")").remove();
			$("#x-wrapper-2 i:eq(" + ($('#x-wrapper-2 i').length - 1) + ")").remove();
			songCounter -= 1;
			if (songCounter === 0) {
				$(".add-inst").css("display", "block");
			}
		})
		songCounter +=1;
		$("." + (Object.keys(myJuke.songs).length-1)).dblclick(function(e){
			$("#musicPlayer").attr("src",  myJuke.songs[parseInt($(e.currentTarget).attr("class").split(" ")[1])].site);
			setTimeout(function() {
				player.play()
			}, 150);
			$("#musicPlayer").on("ended", function(){
				$("#music-playing").css("display", "none")
				$("#no-music").css("display", "block")
			})
		});
		$("." + (Object.keys(myJuke.songs).length-1)).draggable({containment: "document", cursor: "pointer", revert: true, opacity: 0.60, start: function(){
			contents = $(this).text();
			identifier = $(this).attr("class").split(" ")[1];
		}});
		$("#artistname").val("");
		$("#songname").val("");
		$("#urlname").val("");
	}

	//Function clears all songs from tracklist.
	function clearTracks() {
		$(".add-inst").css("display", "block");
		for (var i = 0; i < Object.keys(myJuke.songs).length; i++){
			$("#all-tracks li:eq(" + 0 + ")").remove();
			$("#x-wrapper-2 i:eq(" + 0 + ")").remove();
		}
			myJuke.songs = {}
			songCounter = 0
	}

	//Click function to submit a new song. If media source is playable, the song is added to the page and the myJuke object. If the song is not playable
	//an error message is produced.
	$("#new-song-submit").click(function(){
		$("#musicPlayer2").off("error")
		$("#musicPlayer2").attr("src",  $("#urlname").val());
		$("#musicPlayer2").on("error", function(){
			canPlay = false
			$("#error-message").css("display", "block")
			$(".line-break").css("display", "none")
			setTimeout(function(){
				canPlay=true
			},300)
		})
		setTimeout(function(){
			if(canPlay === true) {
				$("#error-message").css("display", "none")
				$(".line-break").css("display", "block")
				addNewSong()
			}
		}, 200);
	});

	//Click function to clear the tracklist and save the empty playlist in the cookies.
	$("#clear-tracklist").click(function(){
		clearTracks()
		Cookies.set("playlist", JSON.stringify(myJuke))
	})

	//Click function to restore the playlist that is provided by default.
	$("#default-tracklist").click(function(){
		Cookies.set("playlist", undefined)
			clearTracks()
			defaultSetup()
			allTracksInitializer()
			addInteraction()

	})

	//Function to randomize HTML elements.
	$.fn.randomize = function(selector){
	  var $elems = selector ? $(this).find(selector) : $(this).children(),
	      $parents = $elems.parent();

	  $parents.each(function(){
	      $(this).children(selector).sort(function(){
	        return Math.round(Math.random()) - 0.5;
	      }).detach().appendTo(this);
	    });
	    return this;
	};

	//Defines functionality for the play button. If the player is paused and the music player has a source and the song has not finished,
	//continue playing the song. Otherwise, stop the music, reset the current count and run the playMusic() function.

	$(".plist-play").click(function(){
		if(player.paused && $("#musicPlayer").attr("src") !== "" && player.currentTime !== player.duration){
			player.play();
			$("#music-playing").css("display", "block")
			$("#no-music").css("display", "none")
			} else {
				stopMusic();
				currentCount = 0;
				playMusic();
		}
	});

	//Finds the playlist song that corresponds to the current count. Uses the list items second class name as the index number to find the appropriate
	//myJuke.songs item. Grabs the .site attribute of that particular song and makes it the source for the player, then plays the song. If the current count
	//of the playlist is not equal to one less than the length of the playlist, creates an event listener that will play the following song once the current
	//one has ended. If the current count is equal to one less than the length of the playlist, turns off the "ended" event listener.
	function playMusic(){
		var plistClass = $("#plist li:eq("+ (currentCount).toString()+ ")").attr("class").split(" ")[1];
		$("#musicPlayer").attr("src",  myJuke.songs[parseInt(plistClass.slice(1, plistClass.length))].site);
		setTimeout(function() {
				player.play()
			}, 150);
		$("#music-playing").css("display", "block")
		$("#no-music").css("display", "none")
		if (currentCount !== $("#plist li").length - 1){
			$("#musicPlayer").on("ended", function(){
				$("#music-playing").css("display", "none")
				$("#no-music").css("display", "block")
				currentCount += 1;
				var nowPlaying = $("#plist li:eq("+ (currentCount).toString()+ ")").attr("class").split(" ")[1];
				$("#musicPlayer").attr("src",  myJuke.songs[parseInt(nowPlaying.slice(1, nowPlaying.length))].site);
				setTimeout(function() {
					player.play()
				}, 150);
				if (currentCount === $("#plist li").length - 1){
					$("#musicPlayer").off("ended");
				}
			});
		}
	}

	//Click event for the shuffle button. It runs the stopMusic() function, uses the previously created .randomize function to rearange the songs in the 
	//plist div, resets the current count, then runs the playMusic() function.

	$(".plist-shuffle").click(function(){
		stopMusic();
		$("#plist").randomize("li");
		currentCount = 0;
		playMusic();
	});

	//click event for the pause button. Pauses the music.
	$(".plist-pause").click(function(){
		player.pause();
		$("#music-playing").css("display", "none")
		$("#no-music").css("display", "block")
	});

	//If the player is muted, unmute the player, change the font-awesome class to reflect the appropriate icon, adjust the css to keep neighboring elements
	//in place. Do exact opposite if the player is not muted.
	$(".plist-mute").click(function (){
		if(player.muted == true){
			player.muted = false;
			$(".plist-mute").removeClass("fa-volume-off");
			$(".plist-mute").addClass("fa-volume-up");
			$("#default-bar").css("margin-left", "0px");
			} else {
				player.muted = true;
				$(".plist-mute").removeClass("fa-volume-up");
				$(".plist-mute").addClass("fa-volume-off");
				$("#default-bar").css("margin-left", "15px");
		}
	});

	//Converts time from seconds to minutes:seconds with appropriate zero padding.
	function timeFormat(timeInput){
		var minutes = parseInt(timeInput / 60),
				seconds = function(){
					var holder = parseInt(timeInput - (minutes * 60)),
					rslt;
					if (holder < 10){
						rslt = "0" + holder;
						} else {
							rslt = holder.toString();
					}
					return rslt;
				}
		return minutes.toString() + ":" + seconds();
	}

	//Runs stopMusic() function when clicked.
	$(".plist-stop").click(stopMusic);

	//Turns off any "ended" event listeners on the player, clears the player's src attribute, ends the song, sets the players currentTime to 0, removes
	//i element arrow which denotes the song that is currently playing.
	function stopMusic(){
		$("#music-playing").css("display", "none")
		$("#no-music").css("display", "block")
		$("#musicPlayer").off("ended");
		$("#musicPlayer").attr("src", "");
		player.ended = true;
		player.currentTime = 0;
		$("#plist li i").remove();
	}

	//Runs stopMusic() function, adds 1 to the counter, runs the playMusic() function.
	$(".plist-next").click(function (){
		stopMusic();
		currentCount += 1;
		playMusic();
	});	

	//Click function for the previous song button. If the song is more than 3 seconds in, plays the song from the beginning. Otherwise, plays the previous song.
	$(".plist-previous").click(function(){
		if (player.currentTime > 3){
			currentCount;
			} else {
				currentCount -= 1;
		}
		stopMusic();
		playMusic();
	});	

	//Event listener for establishing the placement of the "now playing" arrow. If the source in the player is equal to the source of the song in the playlist,
	//then an i class is appended to produce a left arrow. The arrow is removed when the "ended" event is fired or the duration of the song changes.

	$("#musicPlayer").on("loadedmetadata", function(){
		$("#total-time").html(timeFormat(player.duration));
		if ($("#plist li").length > 0) {
			var plistClass = $("#plist li:eq("+ (currentCount).toString()+ ")").attr("class").split(" ")[1]
			if ($("#musicPlayer").attr("src")===myJuke.songs[parseInt(plistClass.slice(1, plistClass.length))].site){
				var prev = currentCount;
				$("#plist li:eq("+ (currentCount).toString()+ ")").append("<i class='fa fa-arrow-left now-playing' aria-hidden='true'></i>");
				$("#musicPlayer").on("ended", function(){
					$("#music-playing").css("display", "none")
					$("#no-music").css("display", "block")
					$("#plist li:eq("+ (prev).toString()+ ") i").remove();
				});
				$("#musicPlayer").on("durationchange", function(){
					$("#plist li:eq("+ (prev).toString()+ ") i").remove();
				});
			}
		}
	});
	
	//Event listener to establish how long the track bar should be. Creates a click event listener for the track bar
	//which changes the current time of the song dependent on where you've clicked on the track bar.

	$("#musicPlayer").on("timeupdate", function(){
		var size = parseInt(player.currentTime * $("#default-bar").width() /player.duration);
		$("#current-time").html(timeFormat(player.currentTime));
		$("#progress-bar").width(size + "px");
		$("#default-bar").click(function(e) {
			if (!$("#musicPlayer").ended){
				var mouseX = e.pageX - $("#default-bar").offset().left;
				var newTime = mouseX * player.duration / $("#default-bar").width();
				player.currentTime = newTime;
				$("#progress-bar").width(mouseX + "px");
			}
		});
	});

	$("#musicPlayer").on("play", function(){
		$("#music-playing").css("display", "block")
		$("#no-music").css("display", "none")
	});

	$("#musicPlayer").on("ended", function(){
		$("#music-playing").css("display", "none")
		$("#no-music").css("display", "block")
	});


	$("#plist").on("drop", function(event) {
	    $(".drag-inst").css("display", "none");
	});
});
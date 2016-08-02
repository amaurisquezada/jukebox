$(document).ready(function(){

	var canPlay = true,
			contents,
			currentCount = 0,		
			identifier,
			linkCounter = 0,
			player = $('#musicPlayer').get(0),
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

	if (Cookies.get("playlist") === undefined) {
		var songA = new Song("Lloyd Banks", "On Fire", "sample_songs/fire.mp3"),
				songB = new Song("Kid Ink", "Be Real", "sample_songs/bereal.mp3"),
				songC = new Song("Jay Z", "Gotta Have It", "sample_songs/gotta.mp3"),
				songD = new Song("Lloyd Banks", "Warrior", "sample_songs/warrior.mp3");

		myJuke = new Jukebox();
		myJuke.addSong(songA);
		myJuke.addSong(songB);
		myJuke.addSong(songC);
		myJuke.addSong(songD);
		myJuke.addSong(songA);
		myJuke.addSong(songB);
		myJuke.addSong(songC);
		myJuke.addSong(songD);


		} else {
				myJuke = JSON.parse(Cookies.get("playlist"))
	}

	//add songs in Jukebox.songs to all-tracks div on the right hand side of the page. Add a double-click listener to each song
	//to play the selected song
	for (var i= 0; i< Object.keys(myJuke.songs).length; i++){
		$('#all-tracks').append("<li class='allsongs " + i + "'>" + myJuke.songs[i].artist + "-" + myJuke.songs[i].songName + "</li>")
		$('#x-wrapper-2').append('<i class="fa fa-times remove-song" id="s'+ songCounter + '" aria-hidden="true"></i>');
		$('#s' + songCounter).click(function(e){
			var songId = $(e.currentTarget).attr('id')
			$('#all-tracks li:eq(' + songId.slice(1, songId.length) + ')').remove();
			$('#x-wrapper-2 i:eq(' + ($("#x-wrapper-2 i").length - 1) + ')').remove();
			songCounter -= 1;
			if (songCounter === 0) {
				$('.add-inst').css('display', 'block');
			}
		})
		songCounter +=1;
		$( "#all-tracks li:contains(" +  myJuke.songs[i].songName + ")" ).dblclick(function(e){
			stopMusic();
			$('#musicPlayer').attr('src',  myJuke.songs[parseInt($(e.currentTarget).attr('class').split(' ')[1])].site)
			currentCount = 0
			setTimeout(function() {
				player.play()
			}, 150);
			$('#musicPlayer').on('ended', function(){
				$('#music-playing').css('display', 'none')
				$('#no-music').css('display', 'block')
			})
		})
	}

	//makes all of the songs in the all-tracks div draggable
	$('.allsongs').draggable({containment: 'document', cursor: 'pointer', helper: 'clone', revert: true, opacity: 0.60, start: function(){
		contents = $(this).text();
		identifier = $(this).attr('class').split(' ')[1];
	}});

	//makes songs from the all-tracks div droppable into the plist div. The second class name is used as the 
	//song's identifier. Adds an adjacent 'X' to the div x-wrapper to remove the appropriate song if clicked. Add's double-click event listener
	//to play songs if fired
	$('#plist').droppable({accept: '.allsongs', tolerance: 'pointer', cursor: 'pointer', revert: true, opacity: 0.60, drop: function(){
		$('#plist').append('<li class="plistsongs p' + identifier + '">' + contents + '</li>');
		$('#x-wrapper').append('<i class="fa fa-times remove-song" id="'+ linkCounter + '" aria-hidden="true"></i>');
		$('#' + linkCounter).click(function(e){
			$('#plist li:eq(' + $(e.currentTarget).attr('id') + ')').remove();
			$('#x-wrapper i:eq(' + ($("#x-wrapper i").length - 1) + ')').remove();
			linkCounter -= 1;
			if (linkCounter === 0) {
				$('.drag-inst').css('display', 'block');
			}
		})
		linkCounter +=1;
			$('.p' + identifier).dblclick(function(e){
				stopMusic();
				currentCount = parseInt($('#plist li').index(e.currentTarget))
				playMusic();
		})
	}});

	//makes the songs in the plist div sortable
	$('#plist').sortable({containment: 'document', tolerance: 'pointer', cursor: 'pointer', revert: true, opacity: 0.60});

	//click function adds a new song to the Jukebox.songs attribute. Adds appropriate drag/double click functionality

	function dust() {
		myJuke.songs[Object.keys(myJuke.songs).length] = {artist: $('#artistname').val(), songName: $('#songname').val(), site: $('#urlname').val()};
		Cookies.set("playlist", JSON.stringify(myJuke));
		console.log(Cookies.get())
		$('#all-tracks').prepend("<li class='allsongs " + (Object.keys(myJuke.songs).length - 1) + "'>" + $('#artistname').val() + "-" + $('#songname').val() + "</li>");
		$('.add-inst').css('display', 'none');
		$('#x-wrapper-2').append('<i class="fa fa-times remove-song" id="s'+ songCounter + '" aria-hidden="true"></i>');
		$('#s' + songCounter).click(function(e){
			var songId = $(e.currentTarget).attr('id')
			$('#all-tracks li:eq(' + songId.slice(1, songId.length) + ')').remove();
			$('#x-wrapper-2 i:eq(' + ($("#x-wrapper-2 i").length - 1) + ')').remove();
			songCounter -= 1;
			if (songCounter === 0) {
				$('.add-inst').css('display', 'block');
			}
		})
		songCounter +=1;
		$("." + (Object.keys(myJuke.songs).length-1)).dblclick(function(e){
			$('#musicPlayer').attr('src',  myJuke.songs[parseInt($(e.currentTarget).attr('class').split(' ')[1])].site);
			setTimeout(function() {
				player.play()
			}, 150);
			$('#musicPlayer').on('ended', function(){
				$('#music-playing').css('display', 'none')
				$('#no-music').css('display', 'block')
			})
		});
		$("." + (Object.keys(myJuke.songs).length-1)).draggable({containment: 'document', cursor: 'pointer', revert: true, opacity: 0.60, start: function(){
			contents = $(this).text();
			identifier = $(this).attr('class').split(' ')[1];
		}});
		$('#artistname').val('');
		$('#songname').val('');
		$('#urlname').val('');
	}

	$('#new-song-submit').click(function(){
		$('#musicPlayer2').off('error')
		$('#musicPlayer2').attr('src',  $('#urlname').val());
		$('#musicPlayer2').on('error', function(){
			canPlay = false
			$('#error-message').css('display', 'block')
			$('.line-break').css('display', 'none')
			setTimeout(function(){
				canPlay=true
			},300)
		})
		setTimeout(function(){
			if(canPlay === true) {
				$('#error-message').css('display', 'none')
				$('.line-break').css('display', 'block')
				dust()
			}
		}, 200);
	});

	//function to randomize elements
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

	//defines functionality for the play button. If the player is paused and the music player has a source and the song has not finished,
	//continue playing the song. Otherwise, stop the music, reset the current count and run the playMusic() function.

	$('.plist-play').click(function(){
		if(player.paused && $('#musicPlayer').attr('src') !== "" && player.currentTime !== player.duration){
			player.play();
			$('#music-playing').css('display', 'block')
			$('#no-music').css('display', 'none')
			} else {
				stopMusic();
				currentCount = 0;
				playMusic();
		}
	});

	//find the playlist song that corresponds to the current count. Use the list items second class name as the index number to find the appropriate
	//myJuke.songs song. Grab the .site attribute of that particular song and make it the source for the player, then play the song. If the current count
	//of the playlist is not equal to one less than the length of the playlist, create an event listener that will play the following song once the current
	//one has ended. If the current count is equal to one less than the length of the playlist, turn off the 'ended' event listener.
	function playMusic(){
		var plistClass = $('#plist li:eq('+ (currentCount).toString()+ ')').attr('class').split(' ')[1];
		$('#musicPlayer').attr('src',  myJuke.songs[parseInt(plistClass.slice(1, plistClass.length))].site);
		setTimeout(function() {
				player.play()
			}, 150);
		$('#music-playing').css('display', 'block')
		$('#no-music').css('display', 'none')
		if (currentCount !== $('#plist li').length - 1){
			$('#musicPlayer').on('ended', function(){
				$('#music-playing').css('display', 'none')
				$('#no-music').css('display', 'block')
				currentCount += 1;
				var nowPlaying = $('#plist li:eq('+ (currentCount).toString()+ ')').attr('class').split(' ')[1];
				$('#musicPlayer').attr('src',  myJuke.songs[parseInt(nowPlaying.slice(1, nowPlaying.length))].site);
				setTimeout(function() {
					player.play()
				}, 150);
				if (currentCount === $('#plist li').length - 1){
					$('#musicPlayer').off('ended');
				}
			});
		}
	}

	//click event for the shuffle button. It runs the stopMusic() function, uses the previously created .randomize function to rearange the songs in the 
	//plist div, resets the current count, then runs the playMusic() function

	$('.plist-shuffle').click(function(){
		stopMusic();
		$('#plist').randomize('li');
		currentCount = 0;
		playMusic();
	});

	//click event for the pause button. Pauses the music.
	$('.plist-pause').click(function(){
		player.pause();
		$('#music-playing').css('display', 'none')
		$('#no-music').css('display', 'block')
	});

	//creates the variable muteButton, which is equal to the mute button element.

	//when clicked, the mute button will fire the function mutOrUnmute

	//if the player is muted, unmute the player, change the font-awesome class to reflect the appropriate icon, adjust the css to keep neighboring elements
	//in place. Do exact opposite if the player is not muted
	$('.plist-mute').click(function (){
		if(player.muted == true){
			player.muted = false;
			$('.plist-mute').removeClass("fa-volume-off");
			$('.plist-mute').addClass("fa-volume-up");
			$('#default-bar').css('margin-left', '0px');
			} else {
				player.muted = true;
				$('.plist-mute').removeClass("fa-volume-up");
				$('.plist-mute').addClass("fa-volume-off");
				$('#default-bar').css('margin-left', '15px');
		}
	});

	//converts time from seconds to minutes:seconds with appropriate zero padding
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

	//runs stopMusic() function when clicked
	$('.plist-stop').click(stopMusic);

	//turns of any 'ended' event listeners on the player, clears the player's src attribute, ends the song, sets the players currentTime to 0, removes
	//i element arrow which denotes the song that is currently playing
	function stopMusic(){
		$('#musicPlayer').off('ended');
		$('#musicPlayer').attr('src', '');
		player.ended = true;
		player.currentTime = 0;
		$('#plist li i').remove();
	}

	//runs nextSong() function on click

	//runs stopMusic() function, adds 1 to the counter, runs the playMusic() function
	$('.plist-next').click(function (){
		stopMusic();
		currentCount += 1;
		playMusic();
	});	

	//runs the previousSong() function when clicked
	//if the song is more than 3 seconds in, play the song from the beginning. Otherwise, play the previous song
	$('.plist-previous').click(function(){
		if (player.currentTime > 3){
			currentCount;
			} else {
				currentCount -= 1;
		}
		stopMusic();
		playMusic();
	});	

	//function for establishing the placement of the 'now playing' arrow. If the source in the player is equal to the source of the song in the playlist,
	//then an i class is appended to produce a left arrow. The arrow is removed when the 'ended' event is fired or the duration of the song changes. This
	//functions runs onloadedmetadata in the html

	$('#musicPlayer').on('loadedmetadata', function(){
		$('#total-time').html(timeFormat(player.duration));
		if ($('#plist li').length > 0) {
			var plistClass = $('#plist li:eq('+ (currentCount).toString()+ ')').attr('class').split(' ')[1]
			if ($('#musicPlayer').attr('src')===myJuke.songs[parseInt(plistClass.slice(1, plistClass.length))].site){
				var prev = currentCount;
				$('#plist li:eq('+ (currentCount).toString()+ ')').append('<i class="fa fa-arrow-left now-playing" aria-hidden="true"></i>');
				$('#musicPlayer').on('ended', function(){
					$('#music-playing').css('display', 'none')
					$('#no-music').css('display', 'block')
					$('#plist li:eq('+ (prev).toString()+ ') i').remove();
				});
				$('#musicPlayer').on('durationchange', function(){
					$('#plist li:eq('+ (prev).toString()+ ') i').remove();
				});
			}
		}
	});
	
	//function to establish how long the track bar should be. Creates a click event listener for the track bar. Runs on time update from html.
	//function that changes the current time of the song dependent on where you've clicked on the track bar.

	$('#musicPlayer').on('timeupdate', function(){
		var size = parseInt(player.currentTime * $("#default-bar").width() /player.duration);
		$('#current-time').html(timeFormat(player.currentTime));
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

	$('#musicPlayer').on('play', function(){
		$('#music-playing').css('display', 'block')
		$('#no-music').css('display', 'none')
	});

	$('#musicPlayer').on('ended', function(){
		$('#music-playing').css('display', 'none')
		$('#no-music').css('display', 'block')
	});


	$("#plist").on("drop", function(event) {
	    $('.drag-inst').css('display', 'none');
	});



});
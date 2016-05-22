$(document).ready(function(){

	Jukebox = function(songs = {}){
		this.songs = songs
		this.addSong = function(newSong){
			songs[Object.keys(songs).length] = newSong
		}
	}

	Song = function(artist, song, site){
		this.artist = artist;
		this.song = song;
		this.site = site;
	}
		if (Cookies.get("playlist") === undefined) {

	// hustlasAmbition = new Song("50 Cent", "Hustla's Ambition", "https://archive.org/download/50CentMix/50Cent-HustlasAmbition.mp3")
	// supposedToDie = new Song("50 Cent", "I'm Supposed to Die Tonight", "https://archive.org/download/50CentMix/50Cent-ImSupposedToDieTonight.mp3")
	// diamonds = new Song("Rihanna", "Diamonds", "https://archive.org/download/Rihanna_15/Rihanna-Diamondsaudio.mp3")
	// warPigs = new Song("Black Sabbath", "War Pigs", "https://archive.org/download/Paranoid_350/01.mp3")
	// paranoid = new Song("Black Sabbath", "Paranoid", "https://archive.org/download/Paranoid_350/02.Mp3")

	// myJuke = new Jukebox();
	// myJuke.addSong(hustlasAmbition);
	// myJuke.addSong(supposedToDie);
	// myJuke.addSong(diamonds);
	// myJuke.addSong(warPigs);
	// myJuke.addSong(paranoid);


	segui = new Song("El Mayor", "Va Segui", "segui.mp3");
	fire = new Song("Lloyd Banks", "On Fire", "fire.mp3");
	bereal = new Song("Kid Ink", "Be Real", "bereal.mp3");
	gotta = new Song("Jay Z", "Gotta Have It", "gotta.mp3");
	warrior = new Song("Lloyd Banks", "Warrior", "warrior.mp3");

	myJuke = new Jukebox();
	myJuke.addSong(segui);
	myJuke.addSong(fire);
	myJuke.addSong(bereal);
	myJuke.addSong(gotta);
	myJuke.addSong(warrior);


	} else {
		myJuke = JSON.parse(Cookies.get("playlist"))
	}

	player = $('#blah').get(0)

	for (var i= 0; i< Object.keys(myJuke.songs).length; i++){
		$('#all-tracks').append("<li class='allsongs " + i + "'>" + myJuke.songs[i].artist + "-" + myJuke.songs[i].song + "</li>")
		$( "li:contains(" +  myJuke.songs[i].song + ")" ).dblclick(function(e){
			$('#blah').attr('src',  myJuke.songs[parseInt($(e.currentTarget).attr('class').split(' ')[1])].site)
			player.play()
			})
	}

	$('.allsongs').draggable({containment: 'document', cursor: 'pointer', revert: true, opacity: 0.60, start: function(){
		contents = $(this).text();
		identifier = $(this).attr('class').split(' ')[1]
	}});

	$('#plist').droppable({accept: '.allsongs', tolerance: 'pointer', cursor: 'pointer', revert: true, opacity: 0.60, drop: function(){
		$('#plist').append('<li class="plistsongs ' + identifier + '">' + contents + '</li>')
			$('.' + identifier).dblclick(function(e){
			$('#blah').attr('src',  myJuke.songs[parseInt($(e.currentTarget).attr('class').split(' ')[1])].site)
			player.play()
		})
	}});

	$('#plist').sortable({containment: 'document', tolerance: 'pointer', cursor: 'pointer', revert: true, opacity: 0.60, update: function(){
		content = $(this).text();
		$('#sort-status').text(content)
	}});

	$('#new-song-submit').click(function(){
		myJuke.addSong({artist: $('#artistname').val(), song: $('#songname').val(), site: $('#urlname').val()})
		$('#all-tracks').prepend("<li class='allsongs " + (Object.keys(myJuke.songs).length - 1) + "'>" + $('#artistname').val() + "-" + $('#songname').val() + "</li>")
		$("." + (Object.keys(myJuke.songs).length-1)).dblclick(function(e){
			$('#blah').attr('src',  myJuke.songs[parseInt($(e.currentTarget).attr('class').split(' ')[1])].site)
			player.play()
			Cookies.set("playlist", JSON.stringify(myJuke))
		})
		$("." + (Object.keys(myJuke.songs).length-1)).draggable({containment: 'document', cursor: 'pointer', revert: true, opacity: 0.60, start: function(){
		contents = $(this).text();
		identifier = $(this).attr('class').split(' ')[1]
	}});
		$('#artistname').val('')
		$('#songname').val('')
		$('#urlname').val('')
	})


	$.fn.randomize = function(selector){
	    var $elems = selector ? $(this).find(selector) : $(this).children(),
	        $parents = $elems.parent();

	    $parents.each(function(){
	        $(this).children(selector).sort(function(){
	            return Math.round(Math.random()) - 0.5;
	        // }). remove().appendTo(this); // 2014-05-24: Removed `random` but leaving for reference. See notes under 'ANOTHER EDIT'
	        }).detach().appendTo(this);
	    });

	    return this;
	};





	currentCount = 0;

	$('.plist-play').click(function(){
		if(player.paused && $('#blah').attr('src') !== "" && player.currentTime !== player.duration){
			player.play()
		} else {
			stopMusic()
			currentCount = 0
			playMusic()			
		}
		})

	function playMusic(){
		$('#blah').attr('src',  myJuke.songs[parseInt($('#plist li:eq('+ (currentCount).toString()+ ')').attr('class').split(' ')[1])].site)
		player.play()
		if (currentCount !== $('#plist li').length - 1){
		$('#blah').on('ended', function(){
		currentCount += 1
		var nowPlaying = $('#plist li:eq('+ (currentCount).toString()+ ')')
		$('#blah').attr('src',  myJuke.songs[parseInt(nowPlaying.attr('class').split(' ')[1])].site)
		player.play()
		if (currentCount === $('#plist li').length - 1){
			$('#blah').off('ended')
			}
			});
		}
	}

	$('.plist-shuffle').click(function(){
		stopMusic()
		$('#plist').randomize('li')
		currentCount = 0
		playMusic()
	})



	$('.plist-pause').click(function(){
		player.pause();
	});


// myAudio = new Audio('someSound.ogg'); 
// myAudio.addEventListener('ended', function() {
//     this.currentTime = 0;
//     this.play();
// }, false);
// myAudio.play();

	var muteButton = $('.plist-mute');

	muteButton.click(muteOrUnmute);

	function muteOrUnmute(){
		if(player.muted == true){
			player.muted = false
			muteButton.removeClass("fa-volume-off")
			muteButton.addClass("fa-volume-up")
		} else {
			player.muted = true
			muteButton.removeClass("fa-volume-up")
			muteButton.addClass("fa-volume-off")
		}
	}



	var totalTime = $('#total-time');
	var currentTime = $('#current-time');


	function timeFormat(timeInput){
		var minutes = parseInt(timeInput / 60)
		var seconds = function(){
			var holder = parseInt(timeInput - (minutes * 60))
			var rslt;
			if (holder < 10){
				rslt = "0" + holder
			} else {
				rslt = holder.toString()
			}
			return rslt;
		}
		return minutes.toString() + ":" + seconds();
	}
	

	setTotalTime = function(){
		totalTime.html(timeFormat(player.duration))
	}

	setCurrentTime = function(){
		currentTime.html(timeFormat(player.currentTime))
	}


	var stopButton = $('.plist-stop')

	stopButton.click(stopMusic);

	function stopMusic(){
		$('#blah').off('ended')
		$('#blah').attr('src', '')
		player.ended = true
		player.currentTime = 0
	}

	var nextButton = $('.plist-next')

	nextButton.click(nextSong);

	function nextSong(){
		stopMusic()
		currentCount += 1
		playMusic()

	}

	var previousButton = $('.plist-previous')

	previousButton.click(previousSong);

	function previousSong(){
		if (player.currentTime > 3){
		currentCount		
		} else {
			currentCount -= 1
		}
		stopMusic()
		playMusic()
	}















});

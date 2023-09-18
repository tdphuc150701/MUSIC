
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PlAYER_STORAGE_KEY = 'Music_Player'
const player = $('.player')
const playlist = $(".playlist");
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')



const app = {
      currentIndex: 0 ,
      isPlaying: false,
      isRandom: false,
      isRepeat: false,
      config : JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY) ) || {},
      setConfig: function(key,value){
        this.config[key] = value
        localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))

      },
      songs: [
      {
          name: 'Unstopable',
          singer: 'Sia',
          path: './assets/music/1.mp3',
          image: './assets/img/1.jpg',
          
        },

        {
          name: 'Attension',
          singer: 'charlie Puth',
          path: './assets/music/2.mp3',
          image: './assets/img/2.jpg',
        },

        {
          name: 'Nguoi Mien Nui Chat',
          singer: 'Double 2T',
          path: './assets/music/3.mp3',
          image: './assets/img/3.jpg',
        },

        {
          name: 'Rockabye',
          singer: 'Anne Marie',
          path: './assets/music/4.mp3',
          image: './assets/img/4.jpg',
        },

        {
          name: 'Legend Never Die',
          singer: 'The Current',
          path: './assets/music/5.mp3',
          image: './assets/img/5.jpg',
        },

        {
          name: 'Chan Ai',
          singer: 'Orange x Khoi x Chau Dang Khoa',
          path: './assets/music/6.mp3',
          image: './assets/img/6.jpg',
        },  

        {
          name: 'Choi Nhu Tui My',
          singer: 'Andree',
          path: './assets/music/7.mp3',
          image: './assets/img/7.jpg',
        },  

        {
          name: 'Mat troi cua em',
          singer: 'Phuong Ly',
          path: './assets/music/8.mp3',
          image: './assets/img/8.jpg',
        },  

        {
          name: 'Seven Years',
          singer: 'Lukas Graham',
          path: './assets/music/9.mp3',
          image: './assets/img/9.jpg',
        },  

        {
          name: 'Wating for Love',
          singer: 'Avicii',
          path: './assets/music/10.mp3',
          image: './assets/img/10.jpg',
        }
      ],

     
    
      render: function(){
         const htmls = this.songs.map((song, index) => {
        return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
        });

        
        playlist.innerHTML = htmls.join("");
        
      },

      defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
          get: function(){
            return this.songs[this.currentIndex]
          }
        })
      },

      handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth

        //Xử lý CD quay và dừng
        const cdThumbAnimate = cdThumb.animate([
          {
            transform: 'rotate(360deg)'
          }
        ], {
          duration: 10000,
          iterations: Infinity
        })

        cdThumbAnimate.pause()
       
        //Xử lý phóng to/ thu nhỏ CD
        document.onscroll = function(){
          const scrollTop = Window.scrollY ||document.documentElement.scrollTop
          const newCdWidth = cdWidth - scrollTop
          cd.style.width = newCdWidth >0 ? newCdWidth + 'px' : 0
          cd.style.opacity = newCdWidth / cdWidth
        }

        //Xử lý khi click Play

        playBtn.onclick =  function(){
          if(_this.isPlaying){
            audio.pause()
          } else {
            audio.play()
          }
        }

        //khi Song được play
        audio.onplay = function(){
          _this.isPlaying = true
          player.classList.add("playing");
          cdThumbAnimate.play()

        }

         //khi Song bị pause
         audio.onpause = function(){
          _this.isPlaying = false
          player.classList.remove("playing");
          cdThumbAnimate.pause()

        }

        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
          if(audio.duration){
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
            progress.value = progressPercent
          }
          
        }

        //Xử lí khi tua Song
        progress.oninput = function(e){
          const seekTime = e.target.value *audio.duration/100
          audio.currentTime = seekTime
        }

        //Khi next Song
        nextBtn.onclick = function(){
          if(_this.isRandom){
            _this.playRandomSong()    
          } else{
            _this.nextSong()

          }
          audio.play()
          _this.render()
          _this.scrollToActiveSong()
        }

        //Khi prev Song
        prevBtn.onclick = function(){
          if(_this.isRandom){
            _this.playRandomSong()
            audio.play()
          } else{
            _this.prevSong()
            audio.play()
          }
          _this.render()
          _this.scrollToActiveSong()
        }

        //Random bài hát , xử lý bật tắt random song
        randomBtn.onclick = function(e){
          _this.isRandom = !_this.isRandom
          _this.setConfig('isRandom', _this.isRandom)
          randomBtn.classList.toggle('active',_this.isRandom)
          
        }

        //Xử lý phát lại
        repeatBtn.onclick = function(e){
          _this.isRepeat = !_this.isRepeat
          _this.setConfig('isRepeat', _this.isRepeat)
          repeatBtn.classList.toggle('active',_this.isRepeat)
        }

        //Xử lý nextSong khi radio end

        audio.onended = function(){
          if(_this.isRepeat){
            audio.play()
          }else{
          nextBtn.onclick()
        }
        }

        // Lắng nghe hành vi click
        playlist.onclick = function(e){
          //closest trả về thẻ cha từ các element
          const songNode = e.target.closest('.song:not(.active')
          if( songNode || e.target.closest('song:not(.option)')){   
            // xử lý khi click vào song     
            if(e.target.closest('.song:not(.active')){
              _this.currentIndex = Number(songNode.dataset.index)
              _this.loadcurrentSong()
              audio.play() 
              _this.render()
            }

            //xử lý khi click vào option
          } 

        }

      },

      scrollToActiveSong: function(){
        setTimeout(()=>{
          $('.song.active').scrollIntoView({
            behavior:'smooth',
            block: 'center'
          })
        },200)
      },

      loadConfig: function(){
        this.isRandom  = this.config.isRandom
        this.isRepeat  = this.config.isRepeat

      },

      loadcurrentSong: function(){        
        heading.textContent = this.currentSong.name
        // cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;  
        audio.src = this.currentSong.path
      },

      nextSong: function(){
        this.currentIndex++ 
        if(this.currentIndex >=this.songs.length){ //Nếu chiều dài của mảng bài hát lớn hơn tổng bài hát
          this.currentIndex = 0
        }
        this.loadcurrentSong()
      },

      prevSong: function(){
        this.currentIndex-- 
        if(this.currentIndex <0){
          this.currentIndex = this.songs.length-1
        }
        this.loadcurrentSong()
      },

      playRandomSong: function(){
        let newIndex
        do{
          newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadcurrentSong()
      },

      start: function(){
        //Gán cấu hình từ config vào Object(ứng dụng)
        this.loadConfig()

        //Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        //Lắng nghe và xử lý các sự kiện (DOM events)
        this.handleEvents()

        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadcurrentSong()

        //Render playlist
        this.render()

        //hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeat)
      }
    }

    app.start()




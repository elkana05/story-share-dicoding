import L from 'leaflet';

class AddStoryView {
  constructor(container) {
    this.container = container;
    this.map = null;
    this.marker = null;
    this.mediaStream = null;
    this.selectedLocation = { lat: null, lon: null };
  }

  render() {
    this.container.innerHTML = `
      <section class="add-story-section container">
        <h1 class="section-title">Add New Story</h1>
        <div class="card add-story-card">
          <form id="add-story-form">
            <div class="form-group camera-group">
              <label for="photo-file">Photo</label>
              <div class="video-container">
                <video id="camera-view" autoplay playsinline class="d-none"></video>
                <canvas id="camera-canvas" class="d-none"></canvas>
                <img id="photo-preview" class="d-none" alt="Photo preview" src="">
              </div>
              <div class="camera-controls">
                <button type="button" id="btn-start-camera" class="btn btn-secondary">Open Camera</button>
                <button type="button" id="btn-capture" class="btn btn-primary d-none">Capture</button>
                <button type="button" id="btn-retake" class="btn btn-secondary d-none">Retake</button>
              </div>
              <p class="text-center my-2">OR</p>
              <input type="file" id="photo-file" accept="image/*" class="form-control" aria-label="Upload photo">
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" name="description" rows="4" required placeholder="Tell your story..."></textarea>
            </div>

            <div class="form-group">
              <p class="font-weight-bold mb-2">Location (Optional - Click on Map)</p>
              <div id="picker-map" class="map map-small"></div>
              <p id="location-text" class="location-text">No location selected</p>
            </div>

            <button type="submit" class="btn btn-primary w-100">Post Story</button>
          </form>
        </div>
      </section>
    `;
  }

  initMapPicker() {
    this.map = L.map('picker-map').setView([-2.5, 118], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap'
    }).addTo(this.map);

    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      this.selectedLocation = { lat, lon: lng };
      
      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
      
      document.getElementById('location-text').innerText = `Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`;
    });
  }

  setupCamera() {
    const video = document.getElementById('camera-view');
    const canvas = document.getElementById('camera-canvas');
    const preview = document.getElementById('photo-preview');
    const btnStart = document.getElementById('btn-start-camera');
    const btnCapture = document.getElementById('btn-capture');
    const btnRetake = document.getElementById('btn-retake');
    const fileInput = document.getElementById('photo-file');

    let currentPhotoFile = null;

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.#stopMediaTracks();
        currentPhotoFile = file;
        preview.src = URL.createObjectURL(file);
        video.classList.add('d-none');
        preview.classList.remove('d-none');
        btnStart.classList.remove('d-none');
        btnCapture.classList.add('d-none');
        btnRetake.classList.add('d-none');
      }
    });

    btnStart.addEventListener('click', async () => {
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = this.mediaStream;
        video.classList.remove('d-none');
        preview.classList.add('d-none');
        
        btnStart.classList.add('d-none');
        btnCapture.classList.remove('d-none');
        btnRetake.classList.add('d-none');
      } catch (err) {
        alert('Camera access denied or unavailable.');
      }
    });

    btnCapture.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        currentPhotoFile = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
        preview.src = URL.createObjectURL(blob);
        video.classList.add('d-none');
        preview.classList.remove('d-none');
        
        btnCapture.classList.add('d-none');
        btnRetake.classList.remove('d-none');
        this.#stopMediaTracks();
      }, 'image/jpeg');
    });

    btnRetake.addEventListener('click', () => {
      btnStart.click();
    });

    return () => currentPhotoFile;
  }

  bindSubmitEvent(handler) {
    const form = this.container.querySelector('#add-story-form');
    const getPhoto = this.setupCamera();
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const description = this.container.querySelector('#description').value;
      const photo = getPhoto();

      if (!photo) {
        alert('Please select or take a photo.');
        return;
      }

      handler({
        description,
        photo,
        lat: this.selectedLocation.lat,
        lon: this.selectedLocation.lon
      });
    });
  }

  #stopMediaTracks() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  destroy() {
    this.#stopMediaTracks();
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }
}

export default AddStoryView;

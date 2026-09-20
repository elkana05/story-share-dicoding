import CONFIG from '../config.js';
import AuthModel from './auth-model.js';

class StoryModel {
  static async getAllStories({ page = 1, size = 10, location = 0 } = {}) {
    const response = await fetch(
      `${CONFIG.BASE_URL}/stories?page=${page}&size=${size}&location=${location}`,
      {
        headers: {
          Authorization: `Bearer ${AuthModel.getToken()}`,
        },
      }
    );
    
    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    
    return responseJson.listStory;
  }

  static async addNewStory({ description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('photo', photo);
    if (lat) formData.append('lat', lat);
    if (lon) formData.append('lon', lon);

    const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AuthModel.getToken()}`,
      },
      body: formData,
    });
    
    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }
    
    return responseJson;
  }

  static async getStoryById(id) {
    const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${AuthModel.getToken()}`,
      },
    });

    const responseJson = await response.json();
    if (responseJson.error) {
      throw new Error(responseJson.message);
    }

    return responseJson.story;
  }
}

export default StoryModel;

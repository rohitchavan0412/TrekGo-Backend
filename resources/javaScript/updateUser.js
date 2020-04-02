import axios from 'axios';
import { showAlert } from './alert';


export const updateUserSetting = async (data) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users//updateMyPassword',
      data
    })

    if (res.data.status === 'success') {
      showAlert('success', 'Updated successfully!');
    }
  } catch (error) {
    showAlert('error', error.responce.data.message);
  }
}
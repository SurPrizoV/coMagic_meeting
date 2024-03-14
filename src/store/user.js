import { makeAutoObservable } from "mobx";

class User {
    data = {
        uid: "",
        displayName: "",
        photo: "",
        error: "",
        loading: false
    }

  constructor() {
    makeAutoObservable(this);
  }

  setLoading () {
    this.data.loading = !this.data.loading
  }
}

export default new User();

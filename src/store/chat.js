import { makeAutoObservable } from "mobx";

class Chat {
  data = {
    message: "",
    error: "",
    loading: false,
  };

  messages = {};

  constructor() {
    makeAutoObservable(this);
  }

  setMessage(e) {
    this.data.message = e;
  }

  setMessages(e) {
    this.messages = e
  }

  setLoading() {
    this.data.loading = !this.data.loading;
  }
}

export default new Chat();

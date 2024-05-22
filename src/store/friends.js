import { makeAutoObservable } from "mobx";

class FriendId {
        data = []

  constructor() {
    makeAutoObservable(this);
  }
}

export default new FriendId();
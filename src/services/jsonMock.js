const users = [
  {
    user_id: 1,
    first_name: "Иванов",
    last_name: "Иван",
    photo:"https://images.unsplash.com/photo-1459356979461-dae1b8dcb702?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint velit quos soluta eos corrupti aperiam.",
    age: "21",
    status: false,
    gender: "male",
    hobbys: ['cool'],
    city: "Москва",
  },
  {
    user_id: 2,
    first_name: "Самохина",
    last_name: "Оксана",
    photo:
      "https://images.unsplash.com/photo-1570751057973-1b84c959ff86?q=80&w=2150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint velit quos soluta eos corrupti aperiam.",
    age: "18",
    status: true,
    gender: "female",
    hobbys: ['loser'],
    city: "Нижний Новгород",
  },
  {
    user_id: 3,
    first_name: "Петрова",
    last_name: "Лена",
    photo:
      "https://images.unsplash.com/photo-1570751057973-1b84c959ff86?q=80&w=2150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint velit quos soluta eos corrupti aperiam.",
    age: "25",
    status: true,
    gender: "female",
    hobbys: ['teacher'],
    city: "Санкт-Петербург",
  },
  {
    user_id: 4,
    first_name: "Музыченко",
    last_name: "Виктор",
    photo:
      "https://images.unsplash.com/photo-1459356979461-dae1b8dcb702?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint velit quos soluta eos corrupti aperiam.",
    age: "23",
    status: true,
    gender: "male",
    hobbys: ['teacher', 'loser'],
    city: "Москва",
  },
  {
    user_id: 5,
    first_name: "Кутузов",
    last_name: "Сергей",
    photo:
      "https://images.unsplash.com/photo-1459356979461-dae1b8dcb702?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint velit quos soluta eos corrupti aperiam.",
    age: "26",
    status: true,
    gender: "male",
    hobbys: ['loser'],
    city: "Орел",
  },
  {
    user_id: 6,
    first_name: "Нечепуренко",
    last_name: "Полина",
    photo:
      "https://images.unsplash.com/photo-1570751057973-1b84c959ff86?q=80&w=2150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint velit quos soluta eos corrupti aperiam.",
    age: "25",
    status: true,
    gender: "female",
    hobbys: ['cool'],
    city: "Москва",
  },
  {
    user_id: 7,
    first_name: "Кузьменко",
    last_name: "Оксана",
    photo:
      "https://images.unsplash.com/photo-1570751057973-1b84c959ff86?q=80&w=2150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint velit quos soluta eos corrupti aperiam.",
    age: "17",
    status: true,
    gender: "female",
    hobbys: ['teacher'],
    city: "Санкт-Петербург",
  },
  {
    user_id: 8,
    first_name: "Володарский",
    last_name: "Николай",
    photo:
      "https://images.unsplash.com/photo-1459356979461-dae1b8dcb702?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint velit quos soluta eos corrupti aperiam.",
    age: "22",
    status: true,
    gender: "male",
    hobbys: ['cool', 'teacher'],
    city: "Москва",
  },
  {
    user_id: 9,
    first_name: "Нечукина",
    last_name: "Мария",
    photo:
      "https://images.unsplash.com/photo-1570751057973-1b84c959ff86?q=80&w=2150&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint velit quos soluta eos corrupti aperiam.",
    age: "28",
    status: true,
    gender: "female",
    hobbys: ['cool'],
    city: "Ростов",
  },
  {
    user_id: 10,
    first_name: "Колесников",
    last_name: "Валера",
    photo:
      "https://images.unsplash.com/photo-1459356979461-dae1b8dcb702?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint velit quos soluta eos corrupti aperiam.",
    age: "22",
    status: true,
    gender: "male",
    hobbys: ['loser'],
    city: "Санкт-Петербург",
  },
];

export default users;

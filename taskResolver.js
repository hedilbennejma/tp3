const {Level} = require('level');
const db = new Level('./tasks-db', { valueEncoding: 'json' });      

// Function to initialize the tasks in the LevelDB database (only run once to initialize)
  const tasks = [
    {
      id: '1',
      title: 'Développement Front-end pour Site E-commerce',
      description: 'Créer une interface utilisateur réactive en utilisant React et Redux pour un site e-commerce.',
      completed: false,
      duration: 2,
    },
    {
      id: '2',
      title: 'Développement Back-end pour Authentification Utilisateur',
      description: "Implémenter un système d'authentification et d'autorisation pour une application web en utilisant Node.js, Express, et Passport.js",
      completed: false,
      duration: 1,
    },
    {
      id: '3',
      title: 'Tests et Assurance Qualité pour Application Web',
      description: 'Développer et exécuter des plans de test et des cas de test complets.',
      completed: false,
      duration: 1,
    },
  ];

  for (const task of tasks) {
     db.put(task.id, task); // Store each task by its ID
  }


const getTasks = async () => {
  const tasks = [];
  for await (const [key, value] of db.iterator()) {
    tasks.push(value); // Push task object into the array
  }
  return tasks;
};
// Function to fetch a single task by ID
const getTaskById = async (id) => {
  try {
    const task = await db.get(id);
    return task;
  } catch (err) {
    if (err.notFound) {
      return null; // Task not found
    }
    throw err; // Other errors
  }
};

  const taskResolver = {
  Query: {
  
  task: async(_, { id }) => {
  return await getTaskById(id);
  },
  tasks: async() => {return await getTasks()},
  },
  Mutation: {
  addTask: async(_, { title, description, completed,duration }) => {
  const task = {
  id: String(tasks.length + 1),
  title,
  description,
  completed,
  duration
  };
  await db.put(task.id, task);
  return task;
  },
  completeTask: async(_, { id }) => {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex !== -1) {
  tasks[taskIndex].completed = true;
  await db.put(id, tasks[taskIndex]);
  return tasks[taskIndex];
  }
  return null;
  },
  changeDescription:async(_, { id, description }) => {
    const taskid=tasks.findIndex(task => task.id === id);
    if(taskid !== -1){
      tasks[taskid].description=description;
      await db.put(id, tasks[taskid]);
      return tasks[taskid];
    }
  },
  deleteTask:async(_, {id})=>{
    const taskid=tasks.findIndex(task => task.id === id);
    if(taskid!=-1){
      await db.del(id);

    }
  }
}
  };
  module.exports = taskResolver;
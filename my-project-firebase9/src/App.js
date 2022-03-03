import Header from './Header'
import "./App.css";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  getDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./index";
import { useEffect, useState } from "react";

function App({ auth }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [id, setId] = useState("");

  //ccылка на коллекцию
  const collectionBooks = collection(db, "books");

  // подписка на обновлении коллекции books
  useEffect(() => {
    onSnapshot(collectionBooks, (snapshot) => {
      let books1 = [];
      snapshot.docs.forEach((doc) => {
        books1.push({ ...doc.data(), id: doc.id });
      });
      setBooks(books1);
      setLoading(false);
    });
  }, []);

  //Подписка на обновления с условием сортировки по временм добаления и автора ТОМ
  useEffect(() => {
    const q = query(collectionBooks, where('author', '==', 'TOM'), orderBy('createdAt'))
    // const q = query(collectionBooks, orderBy('createdAt'))
    onSnapshot(q, (snapshot) => {
      let books2 = [];
      snapshot.docs.forEach((doc) => {
        books2.push({ ...doc.data(), id: doc.id });
      });
      console.log('TOM', books2);
    });
  }, []);

  // Подписка на изменение в документе
  useEffect(() => {
    const docRef = doc(db, "books", 'VE4Er5Co1qhckPQbpUol');
    onSnapshot(docRef, (doc) => {
      console.log('Измененный документ', doc.data(), doc.id)
    })
  }, [])

  //Запрос документа из коллекции books
  useEffect(() => {
    if (id !== '') {
      const docRef = doc(db, "books", id);
      getDoc(docRef).then(doc => console.log('Запрос по id: ', doc.data(), doc.id))
    }
  }, [id])

  //Добавление в коллецию
  const submitAdd = (e) => {
    setLoading(true);
    setError(false);
    e.preventDefault();
    addDoc(collectionBooks, {
      title: e.target.title.value,
      author: e.target.author.value,
      createdAt: serverTimestamp(),
    })
      .then(() => document.querySelector(".add").reset())
      .then(() => setLoading(false));
  };

  //удаление из коллеции
  const submitDelete = (e) => {
    setLoading(true);
    setError(false);
    e.preventDefault();
    const docRef = doc(db, "books", e.target.id.value);
    deleteDoc(docRef)
      .then(() => setId(""))
      .then(() => setLoading(false));
  };

  //обновление данных в документе коллекции
  const submitUpdate = (e) => {
    e.preventDefault();
    const docRef = doc(db, "books", e.target.id.value);
    updateDoc(docRef, {
      title: e.target.newtitle.value,
      author: e.target.newauthor.value
    })
  }

  const onDeleteBook = (id) => {
    setId(id);
  };

  const [view, setView] = useState(true)

  return (
    <div className="wrapper">
      {view && <Header auth={auth} />}
      <div className="main">
        <button onClick={() => setView(value => !value)}>Спрятать HEADER</button>
        <div style={{ marginBottom: 20 }}>
          {books.map((book) => (
            <div
              style={
                id === book.id
                  ? { backgroundColor: "pink", cursor: "pointer" }
                  : { cursor: "pointer" }
              }
              key={book.id}
              onClick={() => onDeleteBook(book.id)}
            >
              {`title: ${book.title}, author: ${book.author}`}
            </div>
          ))}
        </div>

        {error && <h2>Ошибка загрузки</h2>}
        {loading && <h2>Загрузка!!!</h2>}
        <form onSubmit={submitAdd} className="add">
          <label>Title:</label>
          <input type="text" name="title" required />
          <label>Author:</label>
          <input type="text" name="author" required />
          <button>add new books</button>
        </form>

        <form onSubmit={submitDelete} className="delete">
          <label>Delete Id:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            name="id"
            required
          />
          <button>delete a book</button>
        </form>

        <form onSubmit={submitUpdate} className="update">
          <label>Update Id:</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            name="id"
            required
          />
          <label>Title:</label>
          <input name='newtitle' type='text' />
          <label>Author:</label>
          <input name='newauthor' type='text' />
          <button>update a book</button>
        </form>
      </div>
      <div className="footer">
        <h1>Footer</h1>
      </div>
    </div>
  );
}

export default App;

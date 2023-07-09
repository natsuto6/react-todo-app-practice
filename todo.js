class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    const savedItems = window.localStorage.getItem("todo-items");
    this.state = {
      items: savedItems ? JSON.parse(savedItems) : [],
      text: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  render() {
    return (
      <div>
        <h3>TODO</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="new-todo">何をしますか？</label>
          <br />
          <input
            id="new-todo"
            onChange={this.handleChange}
            value={this.state.text}
          />
          <button>追加 #{this.state.items.length + 1}</button>
        </form>
        <ul>
          {this.state.items.map((item) => (
            <TodoItem
              key={item.id}
              item={item}
              handleRemove={this.handleRemove}
              handleEdit={this.handleEdit}
            />
          ))}
        </ul>
      </div>
    );
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.state.text.length === 0) {
      return;
    }
    const newItem = {
      text: this.state.text,
      id: Date.now(),
      editing: false,
      editText: "",
    };
    this.setState((state) => {
      const updatedItems = state.items.concat(newItem);
      window.localStorage.setItem("todo-items", JSON.stringify(updatedItems));
      return {
        items: updatedItems,
        text: "",
      };
    });
  }

  handleRemove(id) {
    this.setState((state) => {
      const updatedItems = state.items.filter((item) => item.id !== id);
      window.localStorage.setItem("todo-items", JSON.stringify(updatedItems));
      return {
        items: updatedItems,
      };
    });
  }

  handleEdit(id, text, isEditing) {
    this.setState((state) => {
      const updatedItems = state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              text: isEditing ? item.text : text,
              editing: isEditing,
              editText: text,
            }
          : item,
      );
      window.localStorage.setItem("todo-items", JSON.stringify(updatedItems));
      return {
        items: updatedItems,
      };
    });
  }
}

class TodoItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { editText: this.props.item.text };
    this.handleEditChange = this.handleEditChange.bind(this);
  }

  handleEditChange(e) {
    this.setState({ editText: e.target.value });
  }

  render() {
    const item = this.props.item;
    if (item.editing) {
      return (
        <li key={item.id}>
          <input value={this.state.editText} onChange={this.handleEditChange} />
          <button
            onClick={() =>
              this.props.handleEdit(item.id, this.state.editText, false)
            }
          >
            完了
          </button>
        </li>
      );
    } else {
      return (
        <li key={item.id}>
          {item.text}
          <button onClick={() => this.props.handleEdit(item.id, "", true)}>
            編集
          </button>
          <button onClick={() => this.props.handleRemove(item.id)}>削除</button>
        </li>
      );
    }
  }
}

ReactDOM.render(<TodoApp />, document.getElementById("root"));

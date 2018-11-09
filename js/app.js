// 匿名函数自执行
; (function () {
	// var todos = [
	// 	{ id: 1, title: "睡觉", completed: false },
	// 	{ id: 2, title: "吃饭", completed: true },
	// 	{ id: 3, title: "喝水", completed: false },
	// 	{ id: 4, title: "学习", completed: false }
	// ]
	Vue.directive('focus',{
		bind (el, binding) {
			// el.focus()
		},
		inserted (el, binding) {
			el.focus()
		}
	})
	Vue.directive('todo-focus',{
		update (el, binding) {
			if(binding.value) el.focus()
		}
	})
	window.vm = new Vue({
		data: {
			todos: JSON.parse(window.localStorage.getItem("todos") || "[]"),
			// todos: window.localStorage.getItem("todos") || [],
			// todos,
			message: 'Todos List',
			currentEditing: null,
			filterText: 'all'
		},
		// 计算属性 一种带有行为的属性（本质为方法，但是不能调用），优势在于可以缓存方法结果
		computed: {
			// 此为简写方式
			// remainingCount () {
			// 	console.log("我被调用了")
			// 	return this.todos.filter(item => item.completed == false).length
			// }
			// 完整写法
			remainingCount: {
				// 取值时调用 get
				get() {
					// console.log("123")
					return this.todos.filter(item => item.completed == false).length
				},
				// 赋值时（实例.方法名 = xxx ）调用 set
				// set () {
				// 	console.log("set()演示")
				// }
			},
			toggleAllState: {
				get() {
					return this.todos.every(item => item.completed)
				},
				set() {
					// 在计算属性的set方法中调用自己 相当于调用计算属性中的get方法
					var flag = !this.toggleAllState
					this.todos.forEach(item => {
						item.completed = flag
					})
				}
			},
			todosFilter () {
				switch (this.filterText) {
					case 'active':
					return this.todos.filter(item => !item.completed)
					break;
					case 'completed':
					return this.todos.filter(item => item.completed)
					break;
					default:
					return this.todos
					break;
				}
			}
		},
		watch: {
			// 监视todos的改变 做业务定制处理
			// 只能监视一层 无法监视子成员的变化
			todos: {
				handler(val, oldVal) {
					// console.log(val)
					// console.log(oldVal)
					// 监视到todos数组的变化 把结果本地化存储
					window.localStorage.setItem('todos', JSON.stringify(val))
				},
				// 深度监测
				deep: true,
				// 是否立即调用(无论是否监测到变化)
				// immediate: true
			},
			// 监听 原有数值 和 新数值
			// message (val, oldVal){
			// 	console.log(oldVal, val)
			// }
		},
		methods: {
			addTodo(e) {
				// var todoText = this.todoText.trim()
				// if(!todoText) return
				// this.todos.push({id: this.todos.length + 1, title: todoText, completed: false})
				// this.todoText = ''
				var todoText = e.target.value.trim() // 通过事件源参数拿到input的文本内容 不滥用v-model
				if (!todoText) return
				const todos = this.todos
				todos.push({ id: todos.length ? todos[todos.length - 1].id + 1 : 1, title: todoText, completed: false })
				// console.log(todoText)
				e.target.value = ''

			},
			handleToggleAllChange(e) {
				var flag = e.target.checked
				this.todos.forEach(item => {
					item.completed = flag
				})
			},
			handleRemoveTodo(index) {
				this.todos.splice(index, 1)
			},
			handleDoubleClick(todo) {
				this.currentEditing = todo
			},
			handleSaveEdit(index, e) {
				var saveEdit = e.target.value.trim()
				const todo = this.todos[index]
				if (!saveEdit.length) {
					this.todos.splice(index, 1)
				} else {
					todo.title = saveEdit
					this.currentEditing = null
				}

			},
			handleCancleEdit() {
				this.currentEditing = null
			},
			handleClearCompleted() {
				// 第一种方式 循环遍历
				// for(let i = 0; i < this.todos.length; i++) {
				// 	if(this.todos[i].completed)
				// 	{
				// 		this.todos.splice(i, 1)
				// 		i-- 
				// 	}
				// }
				// 第二种方式 数组方法 过滤数组
				this.todos = this.todos.filter(item => !item.completed)
			},
			// handleChange(flag) {
			// 	switch (flag) {
			// 		case 'active':
			// 		console.log(111)
			// 		break
			// 		case 'completed':
			// 		console.log(222)
			// 		break
			// 		default:
			// 		break
			// 	}
			// }
		}
	}).$mount('#app')
	window.onhashchange = hashChange
	hashChange()
	function hashChange () {
		vm.filterText = window.location.hash.substr(2)
		// console.log(app.filterText)
	} 
}
)()
export default class Empty {
	view(vnode) {
		return m("div.empty", {style: "height: 100%;"}, [
			m("p.empty-title.h5", vnode.attrs.title),
			m("p.empty-subtitle", vnode.attrs.text)
		])
	}
}
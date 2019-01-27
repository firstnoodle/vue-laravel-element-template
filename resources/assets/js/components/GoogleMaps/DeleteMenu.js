export class DeleteMenu extends google.maps.OverlayView {
    constructor() {
        super()
        this.el = document.createElement('div')
        this.el.className = 'delete-menu'
        this.el.innerHTML = 'Delete'
        
        let menu = this
        google.maps.event.addDomListener(this.el, 'click', () => {
            menu.removeVertex()
        })
    }
    
    onAdd() {
        // 
        let map = this.getMap()
        this.getPanes().floatPane.appendChild(this.el)
        
        this.elListener = google.maps.event.addDomListener(map.getDiv(), 'mousedown', e => {
            if(e.target != this.el) {
                this.close()
            }
        }, true)
    }
    
    onRemove() {
        google.maps.event.removeListener(this.elListener)
        this.el.parentNode.removeChild(this.el)
        
        // clean up
        this.set('position')
        this.set('path')
        this.set('vertex')
    }
    
    close() {
        this.setMap(null)
    }
    
    draw() {
        let position = this.get('position')
        let projection = this.getProjection()
        
        if(!position || !projection) return
        
        let point = projection.fromLatLngToDivPixel(position)
        this.el.style.top = point.y + 'px'
        this.el.style.left = point.x + 'px'
    }
    
    open(map, path, vertex) {
        this.set('position', path.getAt(vertex))
        this.set('path', path)
        this.set('vertex', vertex)
        this.setMap(map)
        this.draw()
    }
    
    removeVertex() {
        let path = this.get('path')
        let vertex = this.get('vertex')
        
        if(!path || vertex == undefined) {
            this.close()
            return
        }
        
        path.removeAt(vertex)
        this.close()
    }
}

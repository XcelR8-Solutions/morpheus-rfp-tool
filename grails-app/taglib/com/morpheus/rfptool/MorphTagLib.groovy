package com.morpheus.rfptool

class MorphTagLib {
	static namespace = 'morph'
    static defaultEncodeAs = 'raw'

    def nav = { attrs, body ->

        def active = false
        def activeMode = attrs.remove('activeMode') ?: 'action'
        def children = attrs.remove('children')
        def spudId = attrs.remove('spudId')
        if (activeMode == 'controller') {
            active = (controllerName == attrs.controller) || (controllerName == attrs.resource)
        } else if (activeMode == 'urlPrefix') {
            active = request.forwardURI.startsWith(attrs.url)
        } else {
            active = ((controllerName == attrs.controller) || (controllerName == attrs.resource)) && actionName == attrs.action
        }

        if ((spudId && request.forwardURI.contains(spudId))) {
            active = true
        }
        if (children) {
            active = children.any { child ->
                def str = child.substring(0, StringUtils.ordinalIndexOf(child, "/", 3))
                request.getForwardURI().contains(str)
            }
        }

        out << "<li class='${active ? 'active' : ''}'>"
        out << g.link(attrs, body)
        out << "</li>"
    }
}

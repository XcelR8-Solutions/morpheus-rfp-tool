package com.morpheus.rfptool

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
        "/rfp-focus-area"(controller: 'RFPFocusArea', action: 'index')
        "/rfp-question-answer"(controller: 'RFPQuestionAnswer', action: 'index')
        "/search"(controller: 'Search', action: 'index')
        "/"(view:'/index')
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}

package com.morpheus.rfptool

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
        "/rfp-focus-area"(controller: 'RFPFocusArea')
        "/rfp-question-answer"(controller: 'RFPQuestionAnswer')
        "/search"(controller: 'Search')
        "/"(view:'/index')
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}

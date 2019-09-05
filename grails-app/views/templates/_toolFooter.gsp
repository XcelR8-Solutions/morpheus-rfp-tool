<footer class="footer">
    <div class="main-container footer-container">
    
            <div class="footer-logo">
                <asset:image src="logos/footer_logo.svg"/>
            </div>
            <div class="footer-words">
                <p>MORPHEUS LLC, ALL RIGHTS RESERVED</p>
                <p>${grails.util.Metadata.current.getApplicationVersion()} <g:meta name="grails.info.app.build-number"/> <g:if test="${grails.util.Metadata.current.getEnvironment() != 'production'}">-${grails.util.Metadata.current.getEnvironment()}-${grails.util.Metadata.current.getApplicationName()}</g:if> &copy; <g:formatDate date="${new Date()}" format="yyyy"/> </p>
            </div>
       
    </div>
</footer>
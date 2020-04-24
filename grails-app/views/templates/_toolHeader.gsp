<header class="top-header">
    <nav class="top-row" role="navigation">
        <div class="container-fluid" id="navfluid">
            <div class="" id="navigationbar">
                <ul class="main-links flex-start">
                    <li>
                        <g:link class="logo" uri="/">
                            <asset:image src="logos/ui_logo.svg" id="logo"/><span class="company-name">MORPHEUS RFP TOOL</span></g:link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
<header class="sub-header">
    <nav class="sub-row" role="navigation">
        <div class="">
            <ul class="sub-links flex-start">
                <morph:nav url="/search" activeMode='urlPrefix'>
                    <asset:image src="icons/docs.svg" class="icon default"/>
                    <asset:image src="icons/docs_hover.svg" class="icon hover"/>
                    <asset:image src="icons/docs_selected.svg" class="icon active"/>
                    <span>Search</span>
                </morph:nav>
                <morph:nav url="/rfp-focus-area" activeMode='urlPrefix'>
                    <asset:image src="icons/checklist.svg" class="icon default"/>
                    <asset:image src="icons/checklist_hover.svg" class="icon hover"/>
                    <asset:image src="icons/checklist_selected.svg" class="icon active"/>
                    <span>RFP Focus Area</span>
                </morph:nav>
                <morph:nav url="/rfp-question-answer" activeMode='urlPrefix'>
                    <asset:image src="icons/checklist.svg" class="icon default"/>
                    <asset:image src="icons/checklist_hover.svg" class="icon hover"/>
                    <asset:image src="icons/checklist_selected.svg" class="icon active"/>
                    <span>RFP Question and Answers</span>
                </morph:nav>
            </ul>
        </div>
    </nav>
</header>

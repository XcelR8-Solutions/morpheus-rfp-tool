<!DOCTYPE html>
<html>
<head>
    <title>Focus Area | Morpheus RFP Tool</title>
    <meta name="layout" content="main"/>
</head>
<body data-page="main-index">
<div class="accounts">
    <div class="accounts-container">
        <div class="row">
            <div class="col-sm-9">
                <div class="section-container">
                	<p class="section-title">FOCUS AREA</p>
                    <g:if test="${flash.error}">
                        <div class="col-sm-12">
                            <div class="status-message-container">
                                <div class="status-message-content error">
                                    <p class="status-msg error" style="display: block">${flash.error}</p>
                                </div>
                            </div>
                        </div>
                    </g:if>
                    <g:if test="${flash.message}">
                        <div class="col-sm-12">
                            <div class="status-message-container">
                                <div class="status-message-content good">
                                    <p class="status-msg good" style="display: block">${flash.message}</p>
                                </div>
                            </div>
                        </div>
                    </g:if>
                    <div class="section-content margin-top">
                        <div class="row">
                            <div class="col-sm-12">
                                <table>
                                    <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Description</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <g:each var="rfpArea" in="${focusAreaList.areas}">
                                        <tr class="clickable section-data-row" data-request-id="${rfpArea.id}">
                                            <td class="">${rfpArea.id}</td>
                                            <td class="">${rfpArea.name}</td>
                                            <td class="">${rfpArea.description}</td>
                                            <td style="display: none;" class="request-link-td">
                                                <g:link namespace="rfpFocusArea" controller="rfp-focus-area" action="edit" id="${rfpArea.id}"></g:link>
                                            </td>
                                        </tr>
                                    </g:each>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="paging-container-bottom row">
                            <div class="col-sm-12">
                                <g:link namespace="rfpFocusArea" controller="rfp-focus-area" action="create" class="button">Add RFP Focus Area</g:link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
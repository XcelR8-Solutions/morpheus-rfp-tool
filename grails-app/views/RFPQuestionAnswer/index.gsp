<!DOCTYPE html>
<html>
<head>
    <title>Question and Answer | Morpheus RFP Tool</title>
    <meta name="layout" content="main"/>
</head>
<body data-page="main-index">
<div class="accounts">
    <div class="accounts-container">
        <div class="row">
            <div class="col-sm-9">
                <div class="section-container">
                	<p class="section-title">QUESTION AND ANSWER</p>
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
                                        <th>Question</th>
                                        <th>Answer</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <g:each var="rfpQA" in="${qaList.questionAnswers}">
                                        <tr class="clickable section-data-row" data-request-id="${rfpQA.id}">
                                            <td class="">${rfpQA.id}</td>
                                            <td class="">${rfpQA.question}</td>
                                            <td class="">${rfpQA.answer}</td>
                                            <td style="display: none;" class="request-link-td">
                                                <g:link namespace="rfpQA" action="edit" id="${rfpQA.id}"></g:link>
                                            </td>
                                        </tr>
                                    </g:each>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div style="padding:20px">&nbsp;</div>
                        <div class="paging-container-bottom row">
                            <div class="col-sm-12">
                                <g:link namespace="rfpQA" action="create" class="button">Add RFP Question/Answer</g:link>
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
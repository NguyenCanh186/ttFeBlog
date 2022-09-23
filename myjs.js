function showList(){
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/blogs/list",
        success: function (blogs) {
            console.log(blogs)
            var tr = [];
            for (var i = 0; i < blogs.length; i++) {
                tr.push('<tr id="vodeptrai">');
                tr.push('<td>' + blogs[i].id + '</td>');
                tr.push('<td>' + blogs[i].title + '</td>');
                tr.push('<td>');
                for (var j = 0; j < blogs[i].covers.length; j++) {
                    tr.push(`<img src="${'http://localhost:8080/image/' + blogs[i].covers[j].name}" width="100px">`)
                }
                tr.push('</td>');

                tr.push('<td>' + blogs[i].content + '</td>');
                tr.push('<td>' + blogs[i].category.name + '</td>');
                tr.push(`<td><button type="button" onclick="showEditForm(${blogs[i].id})"  data-bs-toggle="modal" data-bs-target="#myModal1">Update</button></td>`);
                tr.push(`<td><button onclick="deleteBlog(${blogs[i].id})">Delete</button></td>`)
                tr.push('</tr>');
            }
            $('#tb').append($(tr.join('')));
        }
})
    $(document).delegate('.btn-add', 'click', function(event) {
        event.preventDefault();

        var name = $('#name').val();

        $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            url: "http://localhost:8080/api/blogs",
            data: JSON.stringify({'name': name}),
            cache: false,
            success: function(result) {
                $("#msg").html( "<span style='color: green'>Company added successfully</span>" );
                window.setTimeout(function(){location.reload()},1000)
            },
            error: function(err) {
                $("#msg").html( "<span style='color: red'>Name is required</span>" );
            }
        });
    });
}


showList();

function login() {
    let name = $(`#name`).val();
    let password = $(`#password`).val();
    let user = {
        name : name,
        password: password
    }
    $.ajax({
        type : 'POST',
        url : `http://localhost:8080/login`,
        data : JSON.stringify(user),
        headers : {
            'Accept' : 'application/json',
            'Content-Type' : 'application/json'
        },
        success : function (currentUser) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser))
            let blogs = JSON.parse(localStorage.getItem("currentUser"));
            $.ajax({
                type: 'GET',
                url: `http://localhost:8080/blog/list`,
                headers: {
                    "Authorization": 'Bearer ' + blogs.token
                },
                success: function (userInfo) {
                    if (userInfo.id % 1 == 0)  {
                        location.href = '../blog.html'
                    } else {
                        location.href = '../blog.html'
                    }
                }
            })
        },
        error : function () {
            showErrorMessage('Login failed!')
        }
    })
}







function showCreateForm(){
    let content = `<div class="container">
                    <form id="form-blog">
                        <div class="mb-3">
                            <label for="title" class="form-label">Title</label>
                            <input type="text" name="title" class="form-control" id="title" >
                        </div>
                        <div class="mb-3">
                            <label for="price" class="form-label">Covers</label>
                            <input type="file" name="files" multiple class="form-control" id="files">
                        </div>
                        <div class="mb-3">
                        <label for="list-cate">Category</label>
                        <select name="category" id="list-cate">

                        </select>
                    </div>
                        <div class="mb-3">
                            <label for="content" class="form-label">Content</label>
                            <input name="content" type="text" class="form-control" id="content">
                        </div>
                    </form>
                </div>
                        <div class="modal-footer">
                             <button type="submit" class="btn btn-primary" onclick="create()">Create</button>
                             <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                        </div>`
    $("#showModal").html(content);
    showCategoryList();
}

function showCategoryList() {
    $.ajax({

        type: "GET",
        url: "http://localhost:8080/blogs/cate",
        success:function (cate){
            console.log(cate)
            let content = '';
            let option = document.createElement("option");

            for (let i = 0; i < cate.length; i++) {
                content += `<option value="${cate[i].id}">${cate[i].name}</option>`
                option.value = cate[i].id;
                option.innerText = cate[i].name;
            }
            console.log($("#list-cate").html)
            $("#list-cate").html(content);
            $('#u-list-cate').html(content);
        }
    })
}

function showEditForm(id){
    let content = `<div class="container">
                    <form id="u-form-blog"> 
                        <div class="mb-3">
                            <label for="u-title" class="form-label">Title</label>
                            <input type="text" name="title" class="form-control" id="u-title">
                        </div>
                        <div class="mb-3">
                            <label for="u-covers" class="form-label">Cover</label>
                            <div id="showImg1"></div>
                            <input type="file" name="files" multiple class="form-control" id="u-files">
                        </div>
                        <div class="mb-3">
                            <label for="u-category" class="form-label">Category</label>
                            <select name="category"  id="u-list-cate">

                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="u-content" class="form-label">Content</label>
                            <input type="text" name="content" class="form-control" id="u-content">
                        </div>
                        </form>
                </div>
                <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="editBlog(${id})" data-bs-dismiss="modal">Edit</button>

                        </div>`
    $("#showModalEdit").html(content);
    showCategoryList();
    $.ajax({
        type:"GET",
        url:`http://localhost:8080/blogs/${id}`,
        success:function (blog){
            console.log(blog)
            $('#u-title').val(blog.title)
            let img = ''
            for (let i = 0; i < blog.covers.length; i++) {
                console.log(blog.covers[i])
                img += `<img src="http://localhost:8080/image/${blog.covers[i].name}" width="100">`
            }
            $('#u-category').val(blog.category)
            $('#u-content').val(blog.content)
            $("#showImg1").html(img)
        }
    })
}
showCategoryList();

function create(){
    let form1 = $('#form-blog')[0];
    let blogForm = new FormData(form1);
    $.ajax({
        type:"POST",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        data: blogForm,
        url:"http://localhost:8080/blogs/create",
        success: function (){
            $('#vodeptrai').remove();
            showList();
        }
    });
    event.preventDefault();
}


function deleteBlog(id){
    $.ajax({
        type:"DELETE",
        url:`http://localhost:8080/blogs/delete/${id}`,
        success : function () {
            $('#vodeptrai').remove();
            showList()
        }
    })
}
function editBlog(id){
    let form = $('#u-form-blog')[0];
    console.log(form)
    let blogForm = new FormData(form);
    console.log(blogForm)
    $.ajax({
        type:"PUT",
        enctype: 'multipart/from-data',
        processData: false,
        contentType: false,
        data: blogForm,
        url:`http://localhost:8080/blogs/edit/${id}`,
        success:showList
    })
    event.preventDefault();
}

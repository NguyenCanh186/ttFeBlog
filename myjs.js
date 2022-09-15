function showList(){
    $.ajax({
        type:"GET",
        url:"http://localhost:8081/blogs/list",
        success: function (blogs){
            console.log(blogs)
            let content = '';
            let image = '';
            for (let i = 0; i < blogs.length; i++) {
                blogs[i].covers.forEach(c => {
                    `<img src="${'http://localhost:8081/image/' + c.name }" width="100px">`
                })
                content += `<tr>
        <th scope="row">${i+1}</th>
        <td>${blogs[i].title}</td>
        <td id="showImg"></td>        
        <td>${blogs[i].category.name}</td>
        <td>${blogs[i].content}</td>
        <td><button onclick="deleteBlog(${blogs[i].id})">Delete</button></td>
        <td><button type="button" onclick="showEditForm(${blogs[i].id})" data-bs-toggle="modal" data-bs-target="#myModal1">Update</button></td>
    </tr>`
            }
            //
            $("#showList").html(content);
            $("#showImg").html(image);
        },
        error: function (error) {
            console.log(error)
        }
    })
}
//// <td><img src="${'http://localhost:8080/image/' + blogs[i].covers.name}" width="100px"></td>

showList();






function showCreateForm(){
    let content = `<div class="container">
                    <form>
                        <div class="mb-3">
                            <label for="title" class="form-label">Title</label>
                            <input type="text" class="form-control" id="title" >
                        </div>
                        <div class="mb-3">
                            <label for="price" class="form-label">Covers</label>
                            <input type="file" multiple class="form-control" id="files">
                        </div>
                        <div class="mb-3">
                        <label for="list-cate">Category</label>
                        <select  id="list-cate">

                        </select>
                    </div>
                        <div class="mb-3">
                            <label for="content" class="form-label">Content</label>
                            <input type="text" class="form-control" id="content">
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
    const vodt = document.querySelector.bind(document);
    $.ajax({

        type: "GET",
        url: "http://localhost:8081/blogs/cate",
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
            $('#u-list-cate').innerHTML = content;
        }
    })
}

function showEditForm(id){
    let content = `<div class="container">
                    <form>
                        <div class="mb-3">
                            <label for="u-title" class="form-label">Title</label>
                            <input type="text" class="form-control" id="u-title">
                        </div>
                        <div class="mb-3">
                            <label for="u-covers" class="form-label">Cover</label>
                            <div id="showImg"></div>
                            <input type="text" class="form-control" id="u-covers">
                        </div>
                        <div class="mb-3">
                            <label for="u-category" class="form-label">Category</label>
                            <input type="text" class="form-control" id="u-category">
                        </div>
                        <div class="mb-3">
                            <label for="u-content" class="form-label">Content</label>
                            <input type="text" class="form-control" id="u-content">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="editBlog(${id})" data-bs-dismiss="modal">Edit</button>

                        </div>
                    </form>
                </div>`
    $("#showModalEdit").html(content);
    $.ajax({
        type:"GET",
        url:`http://localhost:8081/blogs/${id}`,
        success:function (blog){
            $('#u-name').val(blog.name)
            $('#u-price').val(blog.price)
            $('#u-quantity').val(blog.quantity)
            $('#u-description').val(blog.description)
            let img = `<img src="http://localhost:8080/image/${blog.image}" width="100">`
            $(`#showImg`).html(img)
        }
    })
}

function create(){
    let title = $(`#title`).val();
    let covers = $(`#covers`)
    let category = $(`#category`).val();
    let content = $(`#content`).val();
    let blogForm = new FormData();
    blogForm.append('title',title);
    blogForm.append('content',content);
    for (let i = 0; i < covers.length; i++) {
        blogForm.append('covers',covers.prop('files')[0]);
    }
    blogForm.append('category',category);

    $.ajax({
        type:"POST",
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        data: blogForm,
        url:"http://localhost:8081/blogs/create",
        success: function (){
            showList()
        }
    });
    event.preventDefault();
}


function deleteBlog(id){
    $.ajax({
        type:"DELETE",
        url:`http://localhost:8081/blogs/delete/${id}`,
        success : function () {
            showList()
        }
    })
}
function editBlog(id){
    let name = $(`#u-name`).val()
    let price = $(`#u-price`).val()
    let quantity = $(`#u-quantity`).val()
    let description = $(`#u-description`).val()
    let image = $(`#u-image`)
    let productForm = new FormData();
    productForm.append('name',name);
    productForm.append('price',price);
    productForm.append('quantity',quantity);
    productForm.append('description',description);
    productForm.append('image',image.prop('files')[0]);
    if (image.prop('files')[0]=== undefined){
        let file = new File([""],"filename.jpg")
        productForm.append('image',file);
    } else {
        productForm.append('image',image.prop('files')[0]);
    }
    $.ajax({
        type:"POST",
        enctype: 'multipart/from-data',
        processData: false,
        contentType: false,
        data: productForm,
        url:`http://localhost:8081/blogs/edit/${id}`,
        success:showList
    })
    event.preventDefault();
}

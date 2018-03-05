// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
var currentProduct = {}
var showForm = false
var editingProduct;

//Helper functions
function toggleForm() {
  showForm = !showForm;
  $('#product-form').remove();
  $('#product-list').toggle();

  if (showForm) {
    $.ajax({
      url: 'http://json-server.devpointlabs.com/api/v1/products',
      method: 'GET',
      data: { id: editingProduct }
    }).done( function(html) {
      $('#toggle').after(html)
    });
  }
}

function getProduct(id) {
  $.ajax({
    url: 'http://json-server.devpointlabs.com/api/v1/products' + id,
    type: 'GET'
  }).done( function(product) {
    if (editingProduct) {
      var li = $("[data-id='" + id + "'")
      $(li).replaceWith(product)
      editingProduct = null;
    } else {
      $('#http://json-server.devpointlabs.com/api/v1/products').append(product);
    }
  });
}

$(document).ready( function() {
  $(document).on('click', '#delete-product', function() {
    var id = $(this).siblings('.product-item').data().id
    $.ajax({
      url: 'http://json-server.devpointlabs.com/api/v1/products' + id,
      type: 'DELETE'
    }).done( function() {
      var row = $("[data-id='" + id + "'")
      row.parent().remove('li')
    });
  });

  $(document).on('click', '#edit-product', function() {
    editingProduct = $(this).siblings('.product-item').data().id
    toggleForm();
  });

  //Form submit handler
  $(document).on('submit', '#product-form form', function(e) {
    e.preventDefault();
    var data = $(this).serializeArray();
    var url = 'http://json-server.devpointlabs.com/api/v1/products';
    var method = 'POST';
    if (editingProduct) {
      url = url + '/' + editingProduct
      method = 'PUT'
    }

    $.ajax({
      url: url,
      type: method,
      dataType: 'JSON',
      data: data
    }).done( function(product) {
      toggleForm();
      getProduct(product.id);
    }).fail( function(err) {
      alert(err.responseJSON.errors)
    });
  });

  //Toggle form click handler
  $('#toggle').on('click', function() {
    toggleForm()
  });

  // select click handler
  $(document).on('click', '.product-item', function() {
    currentProduct.id = this.dataset.id;
    currentProduct.name = this.dataset.name;
    $.ajax({
      url: 'http://json-server.devpointlabs.com/api/v1/products' + currentProduct.id,
      type: 'GET',
      dataType: 'JSON'
    });
  });
});




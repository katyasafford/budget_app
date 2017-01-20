$(function() {
  var $categoryNameInput = $("#categoryName");
  var $categoryLabel = $("#categoryLabel");
  var $categoryAmountInput = $("#categoryAmount");
  var $amountLabel = $("#amountLabel");
  var $submitBtn = $("#submit");

  var $vtiElement = $("#vti");
  var $vxusElement = $("#vxus");

  var $categoryList = $("#category-list");

  var $editCategoryModal = $("#edit-category-modal");
  var $editCategoryTitle = $("#edit-category-title");
  var $editCategoryAmount = $("#edit-category-amount");
  var $saveUpdateButton = $("#category-update");

  var $categories = $('#category-list tbody');

  function loadCategories() {
    firebase.database().ref('categories/').once('value').then(renderCategories);
  }

  firebase.database().ref('categories/').on('value', renderCategories);

  $submitBtn.on('click', createCategory);

  $categories.on('click','.edit', openEditModal);

  $saveUpdateButton.on('click', updateCategory);

  $categories.on('click','.delete', deleteCategory);

  function createCategory() {
    firebase.database().ref('categories/').push({
      category: $categoryNameInput.val(),
      amount: $categoryAmountInput.val()
    });
  }

  function renderCategories(data) {
    $categories.empty();
    var categories = data.val();
    for(var id in categories) {
      var category = categories[id];
      $categoryList.append('<tr data-id="'+id+'"><td>'+category.category+'</td><td>'+category.amount+'</td><td><button class="edit waves-effect waves-light orange accent-2 btn">Edit</button><button class="btn delete purple darken-1">Delete</button></td></tr>');
    }
  }

  function openEditModal() {
    var id = $(this).parent().parent().data('id');
    firebase.database().ref('categories/' + id).once('value').then(function(snapshot) {
      var category = snapshot.val();
      $editCategoryModal.data('card-id', id);
      $editCategoryTitle.val(category.category);
      $editCategoryAmount.val(category.amount);
      $editCategoryModal.openModal();
    });
  }

  function updateCategory() {
    var id = $editCategoryModal.data('card-id');
    firebase.database().ref('/categories/' + id).set({
      category: $editCategoryTitle.val(),
      amount: $editCategoryAmount.val()
    });
  }

  function deleteCategory() {
    var id = $(this).parent().parent().data('id');
    firebase.database().ref('categories/' + id).remove();
  }

  $.ajax({
      method: 'GET',
      url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22VTI%22%2C%22VXUS%22)%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&format=json",

      success: function(data) {
        console.log(data);
        jsonOutput = JSON.stringify(data);
        jsonObject = JSON.parse(jsonOutput);
        var vtiPrice = jsonObject.query.results.quote[0].LastTradePriceOnly;
        var vxusPrice = jsonObject.query.results.quote[1].LastTradePriceOnly;
        //console.log(vtiPrice, vxusPrice);
        $vtiElement.text("VTI today price: $" + vtiPrice);
        $vxusElement.text("VXUS today price: $" + vxusPrice);

      },

      error: function(jqXHR) {
        if (jqXHR.status == 401) {
          msg = 'Unathorized';
          console.log(msg);
        }
        else if (jqXHR.status == 404) {
          msg = "Page Not Found";
          console.log(msg);
        }
      }
  });





});

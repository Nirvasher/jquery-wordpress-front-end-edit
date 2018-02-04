(function ($) {
	$(document).ready(function () {
    var $entryTitle = $('h1.entry-title'); // Skapar en variabel med ett jquery-objekt som pekar på postens titel.

    $('h1.entry-title').after('<button class="edit-button edit-title">Redigera titel</button><button class="edit-title save" style="display: none">Spara titel</button>'); // Lägger till två knapp-element efter titeln.

    function saveData(newTitle) { // Funktion för att spara den nya titeln till databasen via REST api. Har emot en parameter.
      $.ajax({ // Anropar jQuerys ajax-klass.
        url: WPsettings.root + 'wp/v2/posts/' + WPsettings.current_ID, // Ansluter till REST api via url. WPsetting.root och WPsettings.current_ID får vi från restedit-pluginet.
        method: 'post', // Vi vill spara och därmed skicka data, därför post.
        timout: 2000, // En timeout är satt ifall det tar för lång tid.
        beforeSend: function (xhr) { // Körs innan informationen skickas.
          xhr.setRequestHeader('X-WP-Nonce', WPsettings.nonce); // Skickar med nonce via headern, vilket krävs för att Wordpress ska acceptera denna typ av begäran.
          if ($('span.load-error').lenght) { // Om elementet span med klassen load-error finns...
            $('span.load-error').remove(); // Så ta bort elementet helt från DOM.
          }
        },
        data: { // Data-objektet som ska skickas med.
          'title': newTitle // Titeln skickas med.
        },
        complete: function () { // När aja-körningen har kört klart (vare sig om det lyckades eller ej)...
          $('span.load-info').remove(); // Ta bort span med klassen load-info från DOM.
          $('.edit-title.edit-button').prop('disabled', false); // Återaktiverar knappen igen så användaren kan klicka på knappen.
        },
        error: function () { // Om ajax-körningen misslyckades...
          $('.edit-title.edit-button').after('<span class="load-error"> Något gick fel.</span>'); // Lägg till ett nytt element i DOM efter redigerings-knappen.
        }
      });
    }

    $('.edit-button.edit-title').on('click', function (e) { // Lyssnar på redigeringsknappen.
      e.preventDefault(); // Förhindrar eventuellt normalt beteende.

      var $originalTitle = $entryTitle.text(); // Hämtar texten som finns i titeln och lagrar det i variabeln.
      $entryTitle.hide(); // Gömmer titeln (h1-elementet).
      if($('#title-input').length) { // Om det redan finns ett input-fält med id title-input.
        $('#title-input').show().val($originalTitle); // Så visa det och lägg till texten som är lagrad i variabeln.
      } else { // Annars lägg till input i DOM.
        $entryTitle.after('<input type="text" name="title-input" id="title-input" value="' + $originalTitle + '">'); // Lägger till ett inputfält efter titeln i DOM.
      }
      $(this).hide(); // Gömmer redigeringsknappen.
      $('.edit-title.save').show(); // Visar sparningsknappen.
    }); // Slut på onClick för edit.

    $('.save').on('click', function (e) { // Lyssnar på sparningsknappen.
      e.preventDefault(); // Förhindrar eventuellt normalt beteende.

      var $newTitle = $('#title-input').val(); // Hämtar text från inputfält och lagrar det i variabeln.
      if($newTitle.length < 1) { // Kollar hur många tecken som finns i input-fältet, om de är färre än 1...
        alert('Var god ange en titel!'); // Så skicka en alert med ett meddelande.
        return; // Och avbryt körningen av skriptet här.
      }

      $entryTitle.text($newTitle); // Ändrar titeln i h1-elementet på sidan efter det som är lagrat i variabeln newTitle.
      $entryTitle.show(); // Visar h1-elementet.
      $('#title-input').hide(); // Gömmer input-fältet.
      $('.edit-title.edit-button').show().prop('disabled', true); // Visar redigeringsknappen men lägger en disabled på den för att förhindra klick under tiden som ny data sparas.
      $('.edit-title.edit-button').after('<span class="load-info"> Sparar...</span>'); // Lägger till ett meddelande om att det sparas efter redigeringsknappen i DOM.
      $(this).hide(); // Gömmer sparningsknappen.

      saveData($newTitle); // Kör funktionen saveData och skickar med variabeln newTitle som parameter.
    }); // Slut på onClick för save.
	});
})(jQuery);

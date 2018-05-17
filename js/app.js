//W głównym katalogu projektu utwórz katalog o nazwie js. Wewnątrz tego katalogu utwórz plik app.js. Podepnij ten plik do dokumentu HTML. W pliku app.js utwórz obsługę zdarzenia DOMContentLoaded i sprawdź, czy działa.
document.addEventListener("DOMContentLoaded", function () { 
        //Będziemy ćwiczyć programownie obiektowe, a więc całą naszą grę napiszemy jako obiekt `GameOfLife()`, który będzie zawierał informacje o planszy i metody do zarządzania grą. W tym celu w pliku `app.js`:

        //Utwórz konstruktor dla obiektów GameOfLife, który powinien tworzyć naszą grę przyjmując parametry boardWidth i boardHeight. Zdefiniuj mu następujące właściwości:
        // width: wartość parametru boardWidth
        // height: wartość parametru boardHeight
    var GameOfLife = function(boardWidth, boardHeight) {
        var self = this;
        this.width = boardWidth;
        this.height = boardHeight;
        this.board = document.getElementById('board');
        this.cells = [];
        this.interval;

        //musimy stworzyć zmienną, w której przechowamy cały stan przyszłej planszy – będzie to zbiór liczb 0 i 1, a więc tworząc tę zmienną musimy ją zdefiniować jako pustą tablicę
        this.tempBoard = [];
        this.createBoard = function () {
            this.board.style.width = this.width * 10 + 'px';
            this.board.style.height = this.height * 10 + 'px';
            var noOfCells = this.width * this.height;
            for (var i = 0; i < noOfCells; i++) {               //tworzenie div
                var newCell = document.createElement('div');
                this.board.appendChild(newCell);
            }
            this.cells = this.board.querySelectorAll('div');
            //w metodzie createBoard() przeiteruj się po wszystkich elementach zapisanych do atrybutu this.cells i dodaj im event na kliknięcie
            for (var i = 0; i < this.cells.length; i++) {           
                this.cells[i].addEventListener('click', function() {
                    this.classList.toggle('live');      //kliknięcie powinno przełączać (dodawać lub odejmować) danemu divowi klasę live
                });
            }
        }    
        //Do obiektu dodaj metodę, która przeliczy współrzędne x i y na indeks tablicy wg. odpowiedniego wzoru. Metoda powinna zwracać element <div> o podanych współrzędnych.                                                               
        this.position = function(x, y) {
            var index = y * this.width + x;
            return this.cells[index];
            console.log(this.position);
        }
        // Zdefiniowanie stanu początkowego

        //Aby łatwiej nam było sprawdzać, czy dobrze programujemy naszą animację stwórzmy metodę, która wyświetli nam w lewym górnym rogu planszy glidera. W tym celu:

        // potrzebna nam będzie metoda setCellState(x, y, state), która komórce o zadanych współrzędnych zmieni stan (na podany w parametrze) za pomocą prostego wyrażenia warunkowego oraz usuwania i dodawania odpowiedniej klasy
        // stwórz metodę firstGlider(), w której ożywisz wybrane przez Ciebie 5 komórek (za pomocą metody setCellState(x, y, 'live')), aby wyświetlić glidera

        
       //potrzebna nam będzie metoda setCellState(x, y, state), która komórce o zadanych współrzędnych zmieni stan (na podany w parametrze) za pomocą prostego wyrażenia warunkowego oraz usuwania i dodawania odpowiedniej klasy
        this.setCellState = function(x, y, state) {
            if (state === 'live') {
                this.position(x,y).classList.add('live');
            } else if (state === 'dead'){
                this.position(x,y).classList.remove('live');
            }
        }
        //metoda ta powinna sprawdzić wszystkich ośmiu sąsiadów komórki o podanych współrzędnych i policzyć ilu z nich żyje
        // ponieważ funkcji computeCellNextState(x, y) musimy podać współrzędne x i y, pamiętaj, aby do chodzenia po planszy użyć pętli w pętli (uważaj na to, żeby iść wiersz po wierszu, a nie kolumna po kolumnie)
        this.computeCellNextState = function (x, y) {
            var livingNeighbours = 0;
            for (var i = y-1; i < y+2; i++) {
                for (var j = x-1; j < x+2; j++) {
                    if (i!==y || j!==x) {
                        if (i >= 0 && i < this.height  && j >= 0 && j < this.width) {
                            if (this.position(j,i).className === 'live') {
                                livingNeighbours++;
                            }
                        }  
                    }
                }
            }
            if (this.position(x,y).className === 'live'){
                if (livingNeighbours === 2 || livingNeighbours === 3) {
                    return 1;
                } else {
                    return 0;
                }
            } else {
                if (livingNeighbours === 3) {
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        // Wyświetlanie nowego stanu tablicy

        // metoda ta powinna przejść po wszystkich komórkach i ustawić im nowy stan bazując na informacjach zapisanych w zmiennej stworzonej w poprzednim kroku
        // ponieważ informacje o tym, jaki stan trzeba ustawić mamy w jednowymiarowej tablicy, łatwiej będzie nam tym razem poruszać się po naszej planszy również jako po jednowymiarowej tablicy – którą zapisaliśmy na samym początku do atrybutu tego obiektu o nazwie cells
        // pamiętaj, że komórki ożywiamy lub uśmiercamy poprzez dodawanie i usuwanie odpowiedniej klasy
        // UWAGA: *żeby przetestować działanie pisanych w tym kroku metod ustawmy tymczasowo wydarzenie na przycisku play, które po kliknięciu pokazuje kolejny krok animacji (czyli printNextGeneration();). *

        this.computeNextGeneration = function() {
            this.tempBoard = [];
            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++) {
                    this.tempBoard.push(this.computeCellNextState(j, i));
                }
            }
        }
        this.printBoard = function() {
            self.computeNextGeneration();
            for (var i = 0; i < self.cells.length; i++) {
                self.cells[i].classList.remove('live');
                if (self.tempBoard[i] === 1) {
                    self.cells[i].classList.add('live');
                }
            }
        }

        //stwórz metodę firstGlider(), w której ożywisz wybrane przez Ciebie 5 komórek (za pomocą metody setCellState(x, y, 'live')), aby wyświetlić glidera

        this.firstGlider = function () {
            this.setCellState(3, 3, 'live');
            this.setCellState(3, 4, 'live');
            this.setCellState(3, 5, 'live');
            this.setCellState(2, 5, 'live');
            this.setCellState(1, 4, 'live');
        }
        // Uruchomienie animacji – guziki play i pause
        // Ostatnim krokiem jest uruchomienie animacji, czyli ustawienie interwału, który co pewną liczbę milisekund wywoła pojedynczy krok gry. Dodaj odpowiedni event do guzika play. Uruchomiony interwał zapisz do zmiennej, aby móc go czyścić po kliknięciu w pause.
        this.play = function() {
            self.pause();
            self.interval = setInterval(self.printBoard, 500);
        }
        this.pause = function() {
            clearInterval(self.interval);
        }
        this.start = function() {
            this.createBoard();
            this.firstGlider();
            this.printBoard();
        }
        
        document.getElementById('play').addEventListener('click', this.play);
        document.getElementById('pause').addEventListener('click', this.pause);
    }

    var boardWidth = prompt("Enter width (between 10 and 120)", "");
    var boardHeight = prompt("Enter height (between 10 and 60)", "");

    var game = new GameOfLife(boardWidth,boardHeight);
    game.start();

});






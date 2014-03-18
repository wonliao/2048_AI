
var app = {

	// 顏色的陣列
	colors : [ 'aliceblue',
				'antiquewhite',
				'aquamarine',
				'lightsalmon',
				'lightgreen',
				'darkseagreen',
				'deeppink',
				'deepskyblue',
				'orangered',
				'gold',
				'slategray',
				'steelblue'],

	side: 4,				// 網格大小，預設 4x4
	m : null,				// 網格陣列
	divs : null,			// 網格上的div元件
	scoreSpan : null, 		// 分數的span元件
	gameOverDiv : null, 	// GameOver訊息的div元件
	score : 0,				// 遊戲分數
	gameOverFlag : false,	// GameOver旗標


	// 初始化
	initialize: function() {
      
		// 創建網格陣列
		app.m = app.createSquareMatrix(app.side);
		
		// 建立網格上的div元件
		app.divs = app.createDivGrid(document.getElementById('gridDiv'), app.side);
		
		// 建立分數的span元件
		app.scoreSpan = document.getElementById('scoreSpan');
		
		// 建立GameOver訊息的div元件
		app.gameOverDiv = document.getElementById('gameOverDiv');

		// 呼叫遊戲開始
		app.startGame();
	},

	// 遊戲開始
	startGame: function() {
		
		// 隨機在網格上產生一個數字2
		app.spawnRandomNumberTwo(app.m);
		
		// 更新 div 元件上的數字顯示及背景顏色
		app.updateDivs(app.m, app.divs, app.colors);
		
		// 呼叫遊戲主迴圈
		app.mainLoop();
	},
	
	// 遊戲主迴圈
	mainLoop: function() {

		// 遊戲主迴圈利用鍵盤鍵入觸發

		// 偵測方向鍵按下，並呼叫 update
		document.onkeydown = function(event) {

			// 判斷遊戲是否結束
			if (app.gameOverFlag)		return;

			switch (event.which) {
			case 37:	// 左
			case 38:	// 上
			case 39:	// 右
			case 40:	// 下
				
				event.preventDefault();
				
				// 更新狀態
				app.update(event.which - 37);
				
				break;
			}
		};
	},
	
	/*================== 下列是支援用的函式 ==================*/

	// 創建網格陣列
	createSquareMatrix: function(side) {
		
		var tempM = [];
		
		for (var y = 0; y < side; y++) {
			tempM.push([]);
			for (var x = 0; x < side; x++) {
				tempM[y].push(0);
			}
		}
		
		return tempM;
	},

	// 建立網格上的div元件
	createDivGrid: function(parent, side) {
	
		var divList = [];
	
		for (var y = 0; y < side; y++) {

			var rowDiv = document.createElement('div');
			rowDiv.className = 'row';
			parent.appendChild(rowDiv);
	
			for (var x = 0; x < side; x++) {

				var colDiv = document.createElement('div');
				colDiv.className = 'column';
				colDiv.innerHTML = '0';
				rowDiv.appendChild(colDiv);
				divList.push(colDiv);
			}

			var clearDiv = document.createElement('div');
			clearDiv.className = 'clear';
			rowDiv.appendChild(clearDiv);
		}
		
		return divList;
	},

	// 隨機在網格上產生一個數字2
 	spawnRandomNumberTwo: function(m) {

		var emptySquares = [];
		
		// 找出空格，並放入陣列emptySquares中
		for (var y = 0; y < m.length; y++) {
			for (var x = 0; x < m[0].length; x++) {
				if (m[y][x] === 0) {
					emptySquares.push([x, y]);
				}
			}
		}
		
		// 沒空格就返回
		if (emptySquares.length === 0) {
			return false;
		}
		
		// 從emptySquares陣列中隨機挑出一個空格
		var index = app.getRandomInt(0, emptySquares.length - 1);
		var square = emptySquares[index];
		
		// 將挑出的空格對應至網格m，並填入數字2
		var x = square[0];
		var y = square[1];
		m[y][x] = 2;
	
		return true;
	},
	
	// 更新 div 元件上的數字顯示及背景顏色
	updateDivs: function(m, divs, colors) {
		
		for (var y = 0; y < m.length; y++) {
			for (var x = 0; x < m[0].length; x++) {
				
				var index = y * m[0].length + x;
				divs[index].innerHTML = m[y][x];
				
				var color;
				
				// 有數字的格子
				if (m[y][x] > 0) {
			
					color = Math.log(m[y][x]) / Math.log(2) % colors.length;
					divs[index].style.color = 'black';
				// 空格
				} else {
			
					color = 0;
					divs[index].style.color = colors[color];
				}
	
				divs[index].style.backgroundColor = colors[color];
				divs[index].style.borderColor = colors[color];
			}
		}
	},

	// 更新狀態
	update: function(direction) {

		// 移動全部方格
		var subScore = app.shiftAllCell(app.m, direction);

		// 沒有成功移動
		if (subScore === -1) {
			
			return false;
		// 有成功移動
		} else {
			
			// 顯示分數
			app.score += subScore;
			app.scoreSpan.innerHTML = app.score;

			// 隨機在網格上產生一個數字2
			app.spawnRandomNumberTwo(app.m);

			// 更新 div 元件上的數字顯示及背景顏色
			app.updateDivs(app.m, app.divs, app.colors);

			// 檢查是否GameOver
			if (!app.isAlive(app.m)) {
		
				app.gameOverFlag = true;
				gameOverDiv.style.visibility = 'visible';
			}

			return true;
		}
	},
		
	// 移動全部方格
	shiftAllCell: function(m, direction) {

		var score = 0;
		var moved = false;
		var subScore;
		
		switch (direction) {
		case 0: // 左
			for (var x = 1; x < m[0].length; x++) {
				for (var y = 0; y < m.length; y++) {
					subScore = app.shiftCell(m, x, y, 0);
					if (subScore >= 0) {
						score += subScore;
						moved = true;
					}
				}
			}
			break;
		case 1: // 上
			for (var y = 1; y < m.length; y++) {
				for (var x = 0; x < m[0].length; x++) {
					subScore = app.shiftCell(m, x, y, 1);
					if (subScore >= 0) {
						score += subScore;
						moved = true;
					}
				}
			}
			break;
		case 2: // 右
			for (var x = m[0].length - 2; x >= 0; x--) {
				for (var y = 0; y < m.length; y++) {
					subScore = app.shiftCell(m, x, y, 2);
					if (subScore >= 0) {
						score += subScore;
						moved = true;
					}
				}
			}
			break;
		case 3: // 下
			for (var y = m.length - 2; y >= 0; y--) {
				for (var x = 0; x < m[0].length; x++) {
					subScore = app.shiftCell(m, x, y, 3);
					if (subScore >= 0) {
						score += subScore;
						moved = true;
					}
				}
			}
			break;
		}
		
		return (moved) ? score : -1;
	},
	
	// 檢查是否GameOver
	// 返回值(bool): true - 遊戲中
	// 				 false - Game Over 
	isAlive: function(m) {

		for (var x = 1; x < m[0].length; x++) {
			if (m[0][x-1] === 0 || m[0][x] === 0 || m[0][x-1] === m[0][x]) {
				return true;
			}
		}
		
		for (var y = 1; y < m.length; y++) {
			if (m[y][0] === 0 || m[y-1][0] === m[y][0]) {
				return true;
			}
		}
		
		for (var y = 1; y < m.length; y++) {
			for (var x = 1; x < m[0].length; x++) {
				if (m[y][x] === 0 || m[y-1][x] === 0 || m[y][x-1] === 0 ||
					m[y-1][x] === m[y][x] || m[y][x-1] === m[y][x]) {
					return true;
				}
			}
		}
		
		return false;
	},
	
	// 移動單一方格
	shiftCell: function(m, x, y, direction) {
	
		if (m[y][x] === 0)
			return -1;
		
		var value = m[y][x],
			xAdd = 0,
			yAdd = 0,
			x2, y2;
		
		switch (direction) {
		case 0:		// 左
			xAdd = -1;
			break;
		case 1:		// 上
			yAdd = -1;
			break;
		case 2:		// 右
			xAdd = +1;
			break;
		case 3:		// 下
			yAdd = +1;
			break;
		}
		
		x2 = x + xAdd;
		y2 = y + yAdd;
	 
		while (x2 >= 0 && x2 < m.length && y2 >= 0 && y2 < m.length) {
			
			 // 來源及目的 值相同時
			if (m[y2][x2] === value) {
				
				// 合併來源及目的
			   m[y2][x2] *= 2;
			   m[y][x] = 0;
			   return m[y2][x2];
			// 目的 有值
			 } else if (m[y2][x2] !== 0) {
				break;
			}
			x2 += xAdd;
			y2 += yAdd;
		}
	
		// 完全沒移動時，不做任何處理
		if (y2 - yAdd === y && x2 - xAdd === x) {
			 return -1;
		}
		
		m[y][x] = 0;
		m[y2-yAdd][x2-xAdd] = value;
		
		return 0;
	},

	// 取隨機數
	getRandomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}	
}

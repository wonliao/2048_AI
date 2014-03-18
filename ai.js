var ai = {
	
	depth: 6,				// 模擬移動層數(AI思考幾步)
	waitTime: 1000,		// 多久執行一次AI
	
	// 初始化
	initialize: function() {
		
		// 執行AI
		ai.runAI();
	},

	// 執行AI
	runAI: function() {
	
		// 檢查遊戲是否結束
		if (!app.gameOverFlag) {
		
			// 進行4個方向測試移動模擬，回傳模擬剩餘空格數最多的方向
			var direction = ai.findMove(app.m, ai.depth);

			// 更新狀態
			app.update(direction);
		
			// 再次執行AI
			setTimeout(function() {
				ai.runAI(app.m, ai.depth, ai.waitTime)
			}, ai.waitTime);
		} else {
		
			console.log("game over");	
		}
	},

	// 進行4個方向測試移動模擬，回傳模擬剩餘空格數最多的方向
	findMove: function(m, depth) {
		
		var move = 0;
		var max = 0;
		
		// 進行4個方向測試移動結果，取出剩餘空格數最多的方向
		for (var i = 0; i < 4; i++) {

			// clone一份 app.m
			var clone = ai.cloneM(m);

			// 檢查目前方向是否可以移動，並往此方向移動1步
			if (app.shiftAllCell(clone, i) === -1) {
				continue;
			}

			// 取出最佳的剩餘空格
			var numEmptyCell = ai.findMaxEmptyCell(clone, depth);
			
			// 記錄最多空格的方向		
			if (numEmptyCell > max) {
				max = numEmptyCell;
				move = i;
			}
		}

		return move;
	},

	// 取出最佳的剩餘空格
	// 這個函式是AI的重點，but… 我是參考別人的解法
	findMaxEmptyCell: function(m, depth) {
	
		if (depth == 0) {

			return ai.countEmptyCell(m);
		} else {
	
			var numEmptyCell = [];
			for (var i = 0; i < 4; i++) {

				var clone = ai.cloneM(m);
				app.spawnRandomNumberTwo(clone);

				if (app.shiftAllCell(clone, i) === -1) {
					continue;
				}

				numEmptyCell.push(ai.findMaxEmptyCell(clone, depth-1));
			}

			return Math.max.apply(null, numEmptyCell);
		}
	},
	
	// 計算剩餘空格
	countEmptyCell: function(m) {

		var numEmptyCell = 0;
		for (var i = 0; i < m.length; i++) {
			for (var j = 0; j < m[0].length; j++) {
				if (m[i][j] === 0) {
					numEmptyCell += 1;
				}
			}
		}
	
		return numEmptyCell;
	},
	
	// clone一份 app.m
	cloneM: function(m) {

		var clone = [];
		for (var i = 0; i < m.length; i++) {

			clone.push(m[i].slice());
		}
		return clone;
	}
}
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var filename = require("path").join(__dirname, "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 			if (err) {
/******/ 				if (__webpack_require__.onError) return __webpack_require__.oe(err);
/******/ 				throw err;
/******/ 			}
/******/ 			var chunk = {};
/******/ 			require("vm").runInThisContext(
/******/ 				"(function(exports) {" + content + "\n})",
/******/ 				{ filename: filename }
/******/ 			)(chunk);
/******/ 			hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		var filename = require("path").join(__dirname, "" + hotCurrentHash + ".hot-update.json");
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			require("fs").readFile(filename, "utf-8", function(err, content) {
/******/ 				if (err) return resolve();
/******/ 				try {
/******/ 					var update = JSON.parse(content);
/******/ 				} catch (e) {
/******/ 					return reject(e);
/******/ 				}
/******/ 				resolve(update);
/******/ 			});
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "a08e38e15067abee5b4d";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_selfInvalidated: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 			invalidate: function() {
/******/ 				this._selfInvalidated = true;
/******/ 				switch (hotStatus) {
/******/ 					case "idle":
/******/ 						hotUpdate = {};
/******/ 						hotUpdate[moduleId] = modules[moduleId];
/******/ 						hotSetStatus("ready");
/******/ 						break;
/******/ 					case "ready":
/******/ 						hotApplyInvalidatedModule(moduleId);
/******/ 						break;
/******/ 					case "prepare":
/******/ 					case "check":
/******/ 					case "dispose":
/******/ 					case "apply":
/******/ 						(hotQueuedInvalidatedModules =
/******/ 							hotQueuedInvalidatedModules || []).push(moduleId);
/******/ 						break;
/******/ 					default:
/******/ 						// ignore requests in error states
/******/ 						break;
/******/ 				}
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash, hotQueuedInvalidatedModules;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus(hotApplyInvalidatedModules() ? "ready" : "idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = "main";
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 		return hotApplyInternal(options);
/******/ 	}
/******/
/******/ 	function hotApplyInternal(options) {
/******/ 		hotApplyInvalidatedModules();
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (
/******/ 					!module ||
/******/ 					(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 				)
/******/ 					continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire &&
/******/ 				// when called invalidate self-accepting is not possible
/******/ 				!installedModules[moduleId].hot._selfInvalidated
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					parents: installedModules[moduleId].parents.slice(),
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		if (hotUpdateNewHash !== undefined) {
/******/ 			hotCurrentHash = hotUpdateNewHash;
/******/ 			hotUpdateNewHash = undefined;
/******/ 		}
/******/ 		hotUpdate = undefined;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = item.parents;
/******/ 			hotCurrentChildModule = moduleId;
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			return hotApplyInternal(options).then(function(list) {
/******/ 				outdatedModules.forEach(function(moduleId) {
/******/ 					if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 				});
/******/ 				return list;
/******/ 			});
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModules() {
/******/ 		if (hotQueuedInvalidatedModules) {
/******/ 			if (!hotUpdate) hotUpdate = {};
/******/ 			hotQueuedInvalidatedModules.forEach(hotApplyInvalidatedModule);
/******/ 			hotQueuedInvalidatedModules = undefined;
/******/ 			return true;
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApplyInvalidatedModule(moduleId) {
/******/ 		if (!Object.prototype.hasOwnProperty.call(hotUpdate, moduleId))
/******/ 			hotUpdate[moduleId] = modules[moduleId];
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js":
/*!*************************************************************************!*\
  !*** ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n__webpack_require__(/*! source-map-support/source-map-support.js */ \"source-map-support/source-map-support.js\").install();\n\nconst socketPath = process.env.ELECTRON_HMR_SOCKET_PATH;\n\nif (socketPath == null) {\n  throw new Error(`[HMR] Env ELECTRON_HMR_SOCKET_PATH is not set`);\n} // module, but not relative path must be used (because this file is used as entry)\n\n\nconst HmrClient = __webpack_require__(/*! electron-webpack/out/electron-main-hmr/HmrClient */ \"electron-webpack/out/electron-main-hmr/HmrClient\").HmrClient; // tslint:disable:no-unused-expression\n\n\nnew HmrClient(socketPath, module.hot, () => {\n  return __webpack_require__.h();\n}); \n// __ts-babel@6.0.4\n//# sourceMappingURL=main-hmr.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZWxlY3Ryb24td2VicGFjay9vdXQvZWxlY3Ryb24tbWFpbi1obXIvbWFpbi1obXIuanM/MWJkYyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixtQkFBTyxDQUFDLDBGQUEwQzs7QUFFbEQ7O0FBRUE7QUFDQTtBQUNBLENBQUM7OztBQUdELGtCQUFrQixtQkFBTyxDQUFDLDBHQUFrRCxZQUFZOzs7QUFHeEY7QUFDQSxTQUFTLHVCQUFnQjtBQUN6QixDQUFDLEU7QUFDRDtBQUNBIiwiZmlsZSI6Ii4vbm9kZV9tb2R1bGVzL2VsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL21haW4taG1yLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCIpLmluc3RhbGwoKTtcblxuY29uc3Qgc29ja2V0UGF0aCA9IHByb2Nlc3MuZW52LkVMRUNUUk9OX0hNUl9TT0NLRVRfUEFUSDtcblxuaWYgKHNvY2tldFBhdGggPT0gbnVsbCkge1xuICB0aHJvdyBuZXcgRXJyb3IoYFtITVJdIEVudiBFTEVDVFJPTl9ITVJfU09DS0VUX1BBVEggaXMgbm90IHNldGApO1xufSAvLyBtb2R1bGUsIGJ1dCBub3QgcmVsYXRpdmUgcGF0aCBtdXN0IGJlIHVzZWQgKGJlY2F1c2UgdGhpcyBmaWxlIGlzIHVzZWQgYXMgZW50cnkpXG5cblxuY29uc3QgSG1yQ2xpZW50ID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKS5IbXJDbGllbnQ7IC8vIHRzbGludDpkaXNhYmxlOm5vLXVudXNlZC1leHByZXNzaW9uXG5cblxubmV3IEhtckNsaWVudChzb2NrZXRQYXRoLCBtb2R1bGUuaG90LCAoKSA9PiB7XG4gIHJldHVybiBfX3dlYnBhY2tfaGFzaF9fO1xufSk7IFxuLy8gX190cy1iYWJlbEA2LjAuNFxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFpbi1obXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js\n");

/***/ }),

/***/ "./ts-out/NodeRendererPixijs/NodeGraphRenderer.js":
/*!********************************************************!*\
  !*** ./ts-out/NodeRendererPixijs/NodeGraphRenderer.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nconst pixi_js_1 = __webpack_require__(/*! pixi.js */ \"pixi.js\");\n\nconst RenderableNode_1 = __webpack_require__(/*! ./RenderableNode */ \"./ts-out/NodeRendererPixijs/RenderableNode.js\"); //A container rendering a NodeCore.NodeGraph\n\n\nclass NodeGraphRenderer extends pixi_js_1.Container {\n  constructor(graph) {\n    super();\n    this._Graph = null; //Should NOT by any means be altered. TODO: Find a way to enforce this.\n\n    this._Graph = graph;\n    this.renderableNodes = new Map();\n    this.savedPositions = new Map();\n    this.savedPositions.set(1, {\n      x: 1,\n      y: 2\n    });\n    this.SetupGraph();\n  }\n\n  SetupGraph() {\n    //TODO: Loop over renderablenodes and destruct them\n    this.renderableNodes.clear();\n    this.UpdateRenderableNodes();\n  } //Ensure we have a renderablenode for each INode in the graph\n\n\n  UpdateRenderableNodes() {\n    if (this._Graph != null) {\n      for (let i = 0; i < this._Graph.Nodes.length; i++) {\n        let cNode = this._Graph.Nodes[i];\n\n        if (this.renderableNodes.has(cNode.index)) {\n          continue; //We already have a renderable node for this INode\n        }\n\n        let rNode = new RenderableNode_1.RenderableNode(cNode, new pixi_js_1.Point(i * 30, i * 50));\n        this.renderableNodes.set(cNode.index, rNode);\n        rNode.Draw();\n        this.addChild(rNode);\n      }\n    }\n  }\n\n}\n\nexports.NodeGraphRenderer = NodeGraphRenderer;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vc3JjL05vZGVSZW5kZXJlclBpeGlqcy9Ob2RlR3JhcGhSZW5kZXJlci50cz9jOWVhIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUVBLHNILENBRUE7OztBQUNBLE1BQWEsaUJBQWIsU0FBdUMsbUJBQXZDLENBQWdEO0FBTTVDLGNBQVksS0FBWixFQUE0QjtBQUN4QjtBQUxJLGtCQUEyQixJQUEzQixDQUlvQixDQUphOztBQU9yQyxTQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLElBQUksR0FBSixFQUF2QjtBQUNBLFNBQUssY0FBTCxHQUFzQixJQUFJLEdBQUosRUFBdEI7QUFDQSxTQUFLLGNBQUwsQ0FBb0IsR0FBcEIsQ0FBd0IsQ0FBeEIsRUFBMkI7QUFBQyxPQUFDLEVBQUMsQ0FBSDtBQUFNLE9BQUMsRUFBQztBQUFSLEtBQTNCO0FBQ0EsU0FBSyxVQUFMO0FBQ0g7O0FBRU8sWUFBVTtBQUNkO0FBQ0EsU0FBSyxlQUFMLENBQXFCLEtBQXJCO0FBRUEsU0FBSyxxQkFBTDtBQUNILEdBckIyQyxDQXdCNUM7OztBQUNRLHVCQUFxQjtBQUN6QixRQUFHLEtBQUssTUFBTCxJQUFlLElBQWxCLEVBQXVCO0FBQ25CLFdBQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxLQUFLLE1BQUwsQ0FBWSxLQUFaLENBQWtCLE1BQXJDLEVBQTZDLENBQUMsRUFBOUMsRUFDQTtBQUNJLFlBQUksS0FBSyxHQUFVLEtBQUssTUFBTCxDQUFZLEtBQVosQ0FBa0IsQ0FBbEIsQ0FBbkI7O0FBQ0EsWUFBRyxLQUFLLGVBQUwsQ0FBcUIsR0FBckIsQ0FBeUIsS0FBSyxDQUFDLEtBQS9CLENBQUgsRUFBeUM7QUFDckMsbUJBRHFDLENBQzNCO0FBQ2I7O0FBQ0QsWUFBSSxLQUFLLEdBQW1CLElBQUksK0JBQUosQ0FDeEIsS0FEd0IsRUFFeEIsSUFBSSxlQUFKLENBQVUsQ0FBQyxHQUFHLEVBQWQsRUFBa0IsQ0FBQyxHQUFHLEVBQXRCLENBRndCLENBQTVCO0FBS0EsYUFBSyxlQUFMLENBQXFCLEdBQXJCLENBQXlCLEtBQUssQ0FBQyxLQUEvQixFQUFzQyxLQUF0QztBQUVBLGFBQUssQ0FBQyxJQUFOO0FBQ0EsYUFBSyxRQUFMLENBQWMsS0FBZDtBQUNIO0FBQ0o7QUFDSjs7QUE1QzJDOztBQUFoRCIsImZpbGUiOiIuL3RzLW91dC9Ob2RlUmVuZGVyZXJQaXhpanMvTm9kZUdyYXBoUmVuZGVyZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBwaXhpX2pzXzEgPSByZXF1aXJlKFwicGl4aS5qc1wiKTtcclxuY29uc3QgUmVuZGVyYWJsZU5vZGVfMSA9IHJlcXVpcmUoXCIuL1JlbmRlcmFibGVOb2RlXCIpO1xyXG4vL0EgY29udGFpbmVyIHJlbmRlcmluZyBhIE5vZGVDb3JlLk5vZGVHcmFwaFxyXG5jbGFzcyBOb2RlR3JhcGhSZW5kZXJlciBleHRlbmRzIHBpeGlfanNfMS5Db250YWluZXIge1xyXG4gICAgY29uc3RydWN0b3IoZ3JhcGgpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX0dyYXBoID0gbnVsbDsgLy9TaG91bGQgTk9UIGJ5IGFueSBtZWFucyBiZSBhbHRlcmVkLiBUT0RPOiBGaW5kIGEgd2F5IHRvIGVuZm9yY2UgdGhpcy5cclxuICAgICAgICB0aGlzLl9HcmFwaCA9IGdyYXBoO1xyXG4gICAgICAgIHRoaXMucmVuZGVyYWJsZU5vZGVzID0gbmV3IE1hcCgpO1xyXG4gICAgICAgIHRoaXMuc2F2ZWRQb3NpdGlvbnMgPSBuZXcgTWFwKCk7XHJcbiAgICAgICAgdGhpcy5zYXZlZFBvc2l0aW9ucy5zZXQoMSwgeyB4OiAxLCB5OiAyIH0pO1xyXG4gICAgICAgIHRoaXMuU2V0dXBHcmFwaCgpO1xyXG4gICAgfVxyXG4gICAgU2V0dXBHcmFwaCgpIHtcclxuICAgICAgICAvL1RPRE86IExvb3Agb3ZlciByZW5kZXJhYmxlbm9kZXMgYW5kIGRlc3RydWN0IHRoZW1cclxuICAgICAgICB0aGlzLnJlbmRlcmFibGVOb2Rlcy5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuVXBkYXRlUmVuZGVyYWJsZU5vZGVzKCk7XHJcbiAgICB9XHJcbiAgICAvL0Vuc3VyZSB3ZSBoYXZlIGEgcmVuZGVyYWJsZW5vZGUgZm9yIGVhY2ggSU5vZGUgaW4gdGhlIGdyYXBoXHJcbiAgICBVcGRhdGVSZW5kZXJhYmxlTm9kZXMoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuX0dyYXBoICE9IG51bGwpIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9HcmFwaC5Ob2Rlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNOb2RlID0gdGhpcy5fR3JhcGguTm9kZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJhYmxlTm9kZXMuaGFzKGNOb2RlLmluZGV4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOyAvL1dlIGFscmVhZHkgaGF2ZSBhIHJlbmRlcmFibGUgbm9kZSBmb3IgdGhpcyBJTm9kZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGV0IHJOb2RlID0gbmV3IFJlbmRlcmFibGVOb2RlXzEuUmVuZGVyYWJsZU5vZGUoY05vZGUsIG5ldyBwaXhpX2pzXzEuUG9pbnQoaSAqIDMwLCBpICogNTApKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyYWJsZU5vZGVzLnNldChjTm9kZS5pbmRleCwgck5vZGUpO1xyXG4gICAgICAgICAgICAgICAgck5vZGUuRHJhdygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRDaGlsZChyTm9kZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5Ob2RlR3JhcGhSZW5kZXJlciA9IE5vZGVHcmFwaFJlbmRlcmVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob2RlR3JhcGhSZW5kZXJlci5qcy5tYXAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./ts-out/NodeRendererPixijs/NodeGraphRenderer.js\n");

/***/ }),

/***/ "./ts-out/NodeRendererPixijs/RenderableNode.js":
/*!*****************************************************!*\
  !*** ./ts-out/NodeRendererPixijs/RenderableNode.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nconst pixi_js_1 = __webpack_require__(/*! pixi.js */ \"pixi.js\");\n\nclass RenderableNode extends pixi_js_1.Graphics {\n  constructor(node, pos) {\n    super();\n    this.interactive = true;\n    this._node = node;\n    this.nameText = new pixi_js_1.Text(node.getName());\n    this.addChild(this.nameText);\n    this.x = pos.x;\n    this.y = pos.y;\n  }\n\n  Draw() {\n    this.lineStyle(4, 0xFF3300, 1);\n    this.beginFill(0x66CCFF);\n    this.drawRect(0, 0, 64, 64);\n    this.endFill();\n  }\n\n}\n\nexports.RenderableNode = RenderableNode;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vc3JjL05vZGVSZW5kZXJlclBpeGlqcy9SZW5kZXJhYmxlTm9kZS50cz8xZmZmIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUdBLE1BQWEsY0FBYixTQUFvQyxrQkFBcEMsQ0FBNEM7QUFJeEMsY0FBWSxJQUFaLEVBQXlCLEdBQXpCLEVBQW1DO0FBQy9CO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLElBQW5CO0FBRUEsU0FBSyxLQUFMLEdBQWEsSUFBYjtBQUVBLFNBQUssUUFBTCxHQUFnQixJQUFJLGNBQUosQ0FBUyxJQUFJLENBQUMsT0FBTCxFQUFULENBQWhCO0FBQ0EsU0FBSyxRQUFMLENBQWMsS0FBSyxRQUFuQjtBQUVBLFNBQUssQ0FBTCxHQUFTLEdBQUcsQ0FBQyxDQUFiO0FBQ0EsU0FBSyxDQUFMLEdBQVMsR0FBRyxDQUFDLENBQWI7QUFDSDs7QUFFTSxNQUFJO0FBRVAsU0FBSyxTQUFMLENBQWUsQ0FBZixFQUFrQixRQUFsQixFQUE0QixDQUE1QjtBQUNBLFNBQUssU0FBTCxDQUFlLFFBQWY7QUFDQSxTQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLENBQWpCLEVBQW9CLEVBQXBCLEVBQXdCLEVBQXhCO0FBQ0EsU0FBSyxPQUFMO0FBQ0g7O0FBdkJ1Qzs7QUFBNUMiLCJmaWxlIjoiLi90cy1vdXQvTm9kZVJlbmRlcmVyUGl4aWpzL1JlbmRlcmFibGVOb2RlLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgcGl4aV9qc18xID0gcmVxdWlyZShcInBpeGkuanNcIik7XHJcbmNsYXNzIFJlbmRlcmFibGVOb2RlIGV4dGVuZHMgcGl4aV9qc18xLkdyYXBoaWNzIHtcclxuICAgIGNvbnN0cnVjdG9yKG5vZGUsIHBvcykge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZSA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5fbm9kZSA9IG5vZGU7XHJcbiAgICAgICAgdGhpcy5uYW1lVGV4dCA9IG5ldyBwaXhpX2pzXzEuVGV4dChub2RlLmdldE5hbWUoKSk7XHJcbiAgICAgICAgdGhpcy5hZGRDaGlsZCh0aGlzLm5hbWVUZXh0KTtcclxuICAgICAgICB0aGlzLnggPSBwb3MueDtcclxuICAgICAgICB0aGlzLnkgPSBwb3MueTtcclxuICAgIH1cclxuICAgIERyYXcoKSB7XHJcbiAgICAgICAgdGhpcy5saW5lU3R5bGUoNCwgMHhGRjMzMDAsIDEpO1xyXG4gICAgICAgIHRoaXMuYmVnaW5GaWxsKDB4NjZDQ0ZGKTtcclxuICAgICAgICB0aGlzLmRyYXdSZWN0KDAsIDAsIDY0LCA2NCk7XHJcbiAgICAgICAgdGhpcy5lbmRGaWxsKCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5SZW5kZXJhYmxlTm9kZSA9IFJlbmRlcmFibGVOb2RlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1SZW5kZXJhYmxlTm9kZS5qcy5tYXAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./ts-out/NodeRendererPixijs/RenderableNode.js\n");

/***/ }),

/***/ "./ts-out/NodeSystem/NodeCore/INode.js":
/*!*********************************************!*\
  !*** ./ts-out/NodeSystem/NodeCore/INode.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nconst NodePort_1 = __webpack_require__(/*! ./NodePort */ \"./ts-out/NodeSystem/NodeCore/NodePort.js\");\n\nclass INode {\n  constructor(config) {\n    this.graph = null;\n    this.index = -1;\n    this.cfg = config;\n    this.inputs = [];\n    this.outputs = [];\n\n    for (let i = 0; i < config.Inputs.length; i++) {\n      this.inputs[i] = new NodePort_1.NodePort();\n    }\n\n    for (let i = 0; i < config.Outputs.length; i++) {\n      this.outputs[i] = new NodePort_1.NodePort();\n    }\n  }\n\n  getName() {\n    return this.cfg.Name;\n  }\n\n  HasInvalidInputs() {\n    for (let i = 0; i < this.inputs.length; i++) {\n      if (!this.inputs[i].isValid) return true;\n    }\n\n    return false;\n  }\n\n  GetInvalidInputs() {\n    let invalidPorts = [];\n\n    for (let i = 0; i < this.inputs.length; i++) {\n      let cInput = this.GetInput(i);\n      if (!cInput.isValid) invalidPorts.push(cInput);\n    }\n\n    return invalidPorts;\n  }\n\n  HasConnectedOuput() {\n    for (let i = 0; i < this.outputs.length; i++) {\n      if (this.outputs[i].connection != null) return true;\n    }\n\n    return false;\n  }\n\n  Connect(outPortNumber, inPortNumber, toNode) {\n    if (this.outputs[outPortNumber].connection != null) {\n      console.log(\"OVERRIDING OUT NODECONNECTION\");\n    }\n\n    if (toNode.inputs[inPortNumber].connection != null) {\n      console.log(\"OVERRIDING IN NODECONNECTION\");\n    }\n\n    if (this.graph != toNode.graph) {\n      console.log(\"Nodes aren't in the same graph\");\n      return null;\n    }\n\n    let nConnection = {\n      NodeA: this,\n      NodeB: toNode,\n      PortIndexA: outPortNumber,\n      PortIndexB: inPortNumber\n    };\n    this.outputs[outPortNumber].connection = nConnection;\n    toNode.inputs[inPortNumber].connection = nConnection; //this.graph.Connections.push(nConnection);\n\n    return nConnection;\n  } //Evaluate all the output values and mark them valid\n  //do this by recursively evaluating non valid input nodes\n  //\n\n\n  EvaluateNode() {\n    //Recursively evaluate invalid input nodes\n    let invalidInputs = this.GetInvalidInputs();\n\n    while (invalidInputs.length > 0 && invalidInputs[0].connection != null && invalidInputs[0].connection.NodeA != null) {\n      invalidInputs[0].connection.NodeA.EvaluateNode(); //TODO: maybe selectively evaluate outputs. EvaluateNode() calculates all outputs (even when not connected).\n\n      invalidInputs = this.GetInvalidInputs();\n    } //Evaluate all outputs\n\n\n    for (let i = 0; i < this.outputs.length; i++) {\n      let nValue = this.GetValue(i);\n      this.outputs[i].value = nValue;\n      this.outputs[i].isValid = true; //Also set connected input's value and set valid. TODO: these should point to the same object to avoid setting the value twice. problem for future jens\n\n      if (this.outputs[i].connection != null) {\n        let conn = this.outputs[i].connection;\n\n        if (conn != null && conn.NodeB != null) {\n          conn.NodeB.inputs[conn.PortIndexB].isValid = true;\n          conn.NodeB.inputs[conn.PortIndexB].value = nValue;\n        }\n      }\n    }\n  }\n\n  GetOutput(outputNumber, evaluate = true) {\n    if (outputNumber < this.outputs.length) {\n      if (evaluate) this.EvaluateNode();\n      return this.outputs[outputNumber];\n    }\n\n    return null;\n  }\n\n  GetInput(portNumber) {\n    return this.inputs[portNumber];\n  }\n\n}\n\nexports.INode = INode;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL05vZGVTeXN0ZW0vTm9kZUNvcmUvSU5vZGUudHM/MDAzNyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFHQTs7QUFFQSxNQUFzQixLQUF0QixDQUEyQjtBQVF2QixjQUFZLE1BQVosRUFBOEI7QUFQdkIsaUJBQTBCLElBQTFCO0FBQ0EsaUJBQWdCLENBQUMsQ0FBakI7QUFPSCxTQUFLLEdBQUwsR0FBVyxNQUFYO0FBQ0EsU0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNBLFNBQUssT0FBTCxHQUFlLEVBQWY7O0FBRUEsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFQLENBQWMsTUFBakMsRUFBeUMsQ0FBQyxFQUExQyxFQUNBO0FBQ0ksV0FBSyxNQUFMLENBQVksQ0FBWixJQUFpQixJQUFJLG1CQUFKLEVBQWpCO0FBQ0g7O0FBRUQsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxPQUFQLENBQWUsTUFBbEMsRUFBMEMsQ0FBQyxFQUEzQyxFQUNBO0FBQ0ksV0FBSyxPQUFMLENBQWEsQ0FBYixJQUFrQixJQUFJLG1CQUFKLEVBQWxCO0FBQ0g7QUFDSjs7QUFFTSxTQUFPO0FBQ1YsV0FBTyxLQUFLLEdBQUwsQ0FBUyxJQUFoQjtBQUNIOztBQUVNLGtCQUFnQjtBQUNuQixTQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsS0FBSyxNQUFMLENBQVksTUFBL0IsRUFBdUMsQ0FBQyxFQUF4QyxFQUEyQztBQUN2QyxVQUFHLENBQUMsS0FBSyxNQUFMLENBQVksQ0FBWixFQUFlLE9BQW5CLEVBQ0ksT0FBTyxJQUFQO0FBQ1A7O0FBRUQsV0FBTyxLQUFQO0FBQ0g7O0FBRU0sa0JBQWdCO0FBRW5CLFFBQUksWUFBWSxHQUFlLEVBQS9COztBQUNBLFNBQUksSUFBSSxDQUFDLEdBQUcsQ0FBWixFQUFlLENBQUMsR0FBRyxLQUFLLE1BQUwsQ0FBWSxNQUEvQixFQUF1QyxDQUFDLEVBQXhDLEVBQ0E7QUFDSSxVQUFJLE1BQU0sR0FBYSxLQUFLLFFBQUwsQ0FBYyxDQUFkLENBQXZCO0FBQ0EsVUFBRyxDQUFDLE1BQU0sQ0FBQyxPQUFYLEVBQ0EsWUFBWSxDQUFDLElBQWIsQ0FBa0IsTUFBbEI7QUFDSDs7QUFFRCxXQUFPLFlBQVA7QUFDSDs7QUFFTSxtQkFBaUI7QUFDcEIsU0FBSSxJQUFJLENBQUMsR0FBRyxDQUFaLEVBQWUsQ0FBQyxHQUFHLEtBQUssT0FBTCxDQUFhLE1BQWhDLEVBQXdDLENBQUMsRUFBekMsRUFBNEM7QUFDeEMsVUFBRyxLQUFLLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLFVBQWhCLElBQThCLElBQWpDLEVBQ0ksT0FBTyxJQUFQO0FBQ1A7O0FBRUQsV0FBTyxLQUFQO0FBQ0g7O0FBRU0sU0FBTyxDQUFDLGFBQUQsRUFBd0IsWUFBeEIsRUFBOEMsTUFBOUMsRUFBMkQ7QUFFckUsUUFBRyxLQUFLLE9BQUwsQ0FBYSxhQUFiLEVBQTRCLFVBQTVCLElBQTBDLElBQTdDLEVBQ0E7QUFDSSxhQUFPLENBQUMsR0FBUixDQUFZLCtCQUFaO0FBQ0g7O0FBRUQsUUFBRyxNQUFNLENBQUMsTUFBUCxDQUFjLFlBQWQsRUFBNEIsVUFBNUIsSUFBMEMsSUFBN0MsRUFDQTtBQUNJLGFBQU8sQ0FBQyxHQUFSLENBQVksOEJBQVo7QUFDSDs7QUFFRCxRQUFHLEtBQUssS0FBTCxJQUFjLE1BQU0sQ0FBQyxLQUF4QixFQUNBO0FBQ0ksYUFBTyxDQUFDLEdBQVIsQ0FBWSxnQ0FBWjtBQUNBLGFBQU8sSUFBUDtBQUNIOztBQUVELFFBQUksV0FBVyxHQUFtQjtBQUM5QixXQUFLLEVBQUUsSUFEdUI7QUFFOUIsV0FBSyxFQUFFLE1BRnVCO0FBRzlCLGdCQUFVLEVBQUUsYUFIa0I7QUFJOUIsZ0JBQVUsRUFBRTtBQUprQixLQUFsQztBQU9BLFNBQUssT0FBTCxDQUFhLGFBQWIsRUFBNEIsVUFBNUIsR0FBeUMsV0FBekM7QUFDQSxVQUFNLENBQUMsTUFBUCxDQUFjLFlBQWQsRUFBNEIsVUFBNUIsR0FBeUMsV0FBekMsQ0ExQnFFLENBNEJyRTs7QUFFQSxXQUFPLFdBQVA7QUFDSCxHQTFGc0IsQ0E0RnZCO0FBQ0E7QUFDQTs7O0FBQ08sY0FBWTtBQUNmO0FBQ0EsUUFBSSxhQUFhLEdBQWUsS0FBSyxnQkFBTCxFQUFoQzs7QUFDQSxXQUFNLGFBQWEsQ0FBQyxNQUFkLEdBQXVCLENBQXZCLElBQTRCLGFBQWEsQ0FBQyxDQUFELENBQWIsQ0FBaUIsVUFBakIsSUFBK0IsSUFBM0QsSUFBbUUsYUFBYSxDQUFDLENBQUQsQ0FBYixDQUFpQixVQUFqQixDQUE0QixLQUE1QixJQUFxQyxJQUE5RyxFQUFtSDtBQUMvRyxtQkFBYSxDQUFDLENBQUQsQ0FBYixDQUFpQixVQUFqQixDQUE0QixLQUE1QixDQUFrQyxZQUFsQyxHQUQrRyxDQUM3RDs7QUFFbEQsbUJBQWEsR0FBRyxLQUFLLGdCQUFMLEVBQWhCO0FBQ0gsS0FQYyxDQVNmOzs7QUFDQSxTQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUcsS0FBSyxPQUFMLENBQWEsTUFBaEMsRUFBd0MsQ0FBQyxFQUF6QyxFQUNBO0FBQ0ksVUFBSSxNQUFNLEdBQUcsS0FBSyxRQUFMLENBQWMsQ0FBZCxDQUFiO0FBRUEsV0FBSyxPQUFMLENBQWEsQ0FBYixFQUFnQixLQUFoQixHQUF3QixNQUF4QjtBQUNBLFdBQUssT0FBTCxDQUFhLENBQWIsRUFBZ0IsT0FBaEIsR0FBMEIsSUFBMUIsQ0FKSixDQU1JOztBQUNBLFVBQUcsS0FBSyxPQUFMLENBQWEsQ0FBYixFQUFnQixVQUFoQixJQUE4QixJQUFqQyxFQUFzQztBQUNsQyxZQUFJLElBQUksR0FBRyxLQUFLLE9BQUwsQ0FBYSxDQUFiLEVBQWdCLFVBQTNCOztBQUNBLFlBQUcsSUFBSSxJQUFJLElBQVIsSUFBZ0IsSUFBSSxDQUFDLEtBQUwsSUFBYyxJQUFqQyxFQUNBO0FBQ0ksY0FBSSxDQUFDLEtBQUwsQ0FBVyxNQUFYLENBQWtCLElBQUksQ0FBQyxVQUF2QixFQUFtQyxPQUFuQyxHQUE2QyxJQUE3QztBQUNBLGNBQUksQ0FBQyxLQUFMLENBQVcsTUFBWCxDQUFrQixJQUFJLENBQUMsVUFBdkIsRUFBbUMsS0FBbkMsR0FBMkMsTUFBM0M7QUFDSDtBQUNKO0FBRUo7QUFDSjs7QUFLTSxXQUFTLENBQUMsWUFBRCxFQUF1QixXQUFvQixJQUEzQyxFQUErQztBQUUzRCxRQUFHLFlBQVksR0FBRyxLQUFLLE9BQUwsQ0FBYSxNQUEvQixFQUNBO0FBQ0ksVUFBRyxRQUFILEVBQ0ksS0FBSyxZQUFMO0FBRUosYUFBTyxLQUFLLE9BQUwsQ0FBYSxZQUFiLENBQVA7QUFDSDs7QUFFRCxXQUFPLElBQVA7QUFDSDs7QUFFUyxVQUFRLENBQUMsVUFBRCxFQUFtQjtBQUVqQyxXQUFPLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBUDtBQUNIOztBQWhKc0I7O0FBQTNCIiwiZmlsZSI6Ii4vdHMtb3V0L05vZGVTeXN0ZW0vTm9kZUNvcmUvSU5vZGUuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBOb2RlUG9ydF8xID0gcmVxdWlyZShcIi4vTm9kZVBvcnRcIik7XHJcbmNsYXNzIElOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbmZpZykge1xyXG4gICAgICAgIHRoaXMuZ3JhcGggPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcclxuICAgICAgICB0aGlzLmNmZyA9IGNvbmZpZztcclxuICAgICAgICB0aGlzLmlucHV0cyA9IFtdO1xyXG4gICAgICAgIHRoaXMub3V0cHV0cyA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlnLklucHV0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB0aGlzLmlucHV0c1tpXSA9IG5ldyBOb2RlUG9ydF8xLk5vZGVQb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29uZmlnLk91dHB1dHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5vdXRwdXRzW2ldID0gbmV3IE5vZGVQb3J0XzEuTm9kZVBvcnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXROYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNmZy5OYW1lO1xyXG4gICAgfVxyXG4gICAgSGFzSW52YWxpZElucHV0cygpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pbnB1dHNbaV0uaXNWYWxpZClcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBHZXRJbnZhbGlkSW5wdXRzKCkge1xyXG4gICAgICAgIGxldCBpbnZhbGlkUG9ydHMgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuaW5wdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBjSW5wdXQgPSB0aGlzLkdldElucHV0KGkpO1xyXG4gICAgICAgICAgICBpZiAoIWNJbnB1dC5pc1ZhbGlkKVxyXG4gICAgICAgICAgICAgICAgaW52YWxpZFBvcnRzLnB1c2goY0lucHV0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGludmFsaWRQb3J0cztcclxuICAgIH1cclxuICAgIEhhc0Nvbm5lY3RlZE91cHV0KCkge1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vdXRwdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm91dHB1dHNbaV0uY29ubmVjdGlvbiAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIENvbm5lY3Qob3V0UG9ydE51bWJlciwgaW5Qb3J0TnVtYmVyLCB0b05vZGUpIHtcclxuICAgICAgICBpZiAodGhpcy5vdXRwdXRzW291dFBvcnROdW1iZXJdLmNvbm5lY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9WRVJSSURJTkcgT1VUIE5PREVDT05ORUNUSU9OXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodG9Ob2RlLmlucHV0c1tpblBvcnROdW1iZXJdLmNvbm5lY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk9WRVJSSURJTkcgSU4gTk9ERUNPTk5FQ1RJT05cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmdyYXBoICE9IHRvTm9kZS5ncmFwaCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5vZGVzIGFyZW4ndCBpbiB0aGUgc2FtZSBncmFwaFwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxldCBuQ29ubmVjdGlvbiA9IHtcclxuICAgICAgICAgICAgTm9kZUE6IHRoaXMsXHJcbiAgICAgICAgICAgIE5vZGVCOiB0b05vZGUsXHJcbiAgICAgICAgICAgIFBvcnRJbmRleEE6IG91dFBvcnROdW1iZXIsXHJcbiAgICAgICAgICAgIFBvcnRJbmRleEI6IGluUG9ydE51bWJlclxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5vdXRwdXRzW291dFBvcnROdW1iZXJdLmNvbm5lY3Rpb24gPSBuQ29ubmVjdGlvbjtcclxuICAgICAgICB0b05vZGUuaW5wdXRzW2luUG9ydE51bWJlcl0uY29ubmVjdGlvbiA9IG5Db25uZWN0aW9uO1xyXG4gICAgICAgIC8vdGhpcy5ncmFwaC5Db25uZWN0aW9ucy5wdXNoKG5Db25uZWN0aW9uKTtcclxuICAgICAgICByZXR1cm4gbkNvbm5lY3Rpb247XHJcbiAgICB9XHJcbiAgICAvL0V2YWx1YXRlIGFsbCB0aGUgb3V0cHV0IHZhbHVlcyBhbmQgbWFyayB0aGVtIHZhbGlkXHJcbiAgICAvL2RvIHRoaXMgYnkgcmVjdXJzaXZlbHkgZXZhbHVhdGluZyBub24gdmFsaWQgaW5wdXQgbm9kZXNcclxuICAgIC8vXHJcbiAgICBFdmFsdWF0ZU5vZGUoKSB7XHJcbiAgICAgICAgLy9SZWN1cnNpdmVseSBldmFsdWF0ZSBpbnZhbGlkIGlucHV0IG5vZGVzXHJcbiAgICAgICAgbGV0IGludmFsaWRJbnB1dHMgPSB0aGlzLkdldEludmFsaWRJbnB1dHMoKTtcclxuICAgICAgICB3aGlsZSAoaW52YWxpZElucHV0cy5sZW5ndGggPiAwICYmIGludmFsaWRJbnB1dHNbMF0uY29ubmVjdGlvbiAhPSBudWxsICYmIGludmFsaWRJbnB1dHNbMF0uY29ubmVjdGlvbi5Ob2RlQSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGludmFsaWRJbnB1dHNbMF0uY29ubmVjdGlvbi5Ob2RlQS5FdmFsdWF0ZU5vZGUoKTsgLy9UT0RPOiBtYXliZSBzZWxlY3RpdmVseSBldmFsdWF0ZSBvdXRwdXRzLiBFdmFsdWF0ZU5vZGUoKSBjYWxjdWxhdGVzIGFsbCBvdXRwdXRzIChldmVuIHdoZW4gbm90IGNvbm5lY3RlZCkuXHJcbiAgICAgICAgICAgIGludmFsaWRJbnB1dHMgPSB0aGlzLkdldEludmFsaWRJbnB1dHMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9FdmFsdWF0ZSBhbGwgb3V0cHV0c1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5vdXRwdXRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGxldCBuVmFsdWUgPSB0aGlzLkdldFZhbHVlKGkpO1xyXG4gICAgICAgICAgICB0aGlzLm91dHB1dHNbaV0udmFsdWUgPSBuVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMub3V0cHV0c1tpXS5pc1ZhbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgLy9BbHNvIHNldCBjb25uZWN0ZWQgaW5wdXQncyB2YWx1ZSBhbmQgc2V0IHZhbGlkLiBUT0RPOiB0aGVzZSBzaG91bGQgcG9pbnQgdG8gdGhlIHNhbWUgb2JqZWN0IHRvIGF2b2lkIHNldHRpbmcgdGhlIHZhbHVlIHR3aWNlLiBwcm9ibGVtIGZvciBmdXR1cmUgamVuc1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vdXRwdXRzW2ldLmNvbm5lY3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGNvbm4gPSB0aGlzLm91dHB1dHNbaV0uY29ubmVjdGlvbjtcclxuICAgICAgICAgICAgICAgIGlmIChjb25uICE9IG51bGwgJiYgY29ubi5Ob2RlQiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29ubi5Ob2RlQi5pbnB1dHNbY29ubi5Qb3J0SW5kZXhCXS5pc1ZhbGlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjb25uLk5vZGVCLmlucHV0c1tjb25uLlBvcnRJbmRleEJdLnZhbHVlID0gblZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgR2V0T3V0cHV0KG91dHB1dE51bWJlciwgZXZhbHVhdGUgPSB0cnVlKSB7XHJcbiAgICAgICAgaWYgKG91dHB1dE51bWJlciA8IHRoaXMub3V0cHV0cy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaWYgKGV2YWx1YXRlKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5FdmFsdWF0ZU5vZGUoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMub3V0cHV0c1tvdXRwdXROdW1iZXJdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIEdldElucHV0KHBvcnROdW1iZXIpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pbnB1dHNbcG9ydE51bWJlcl07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5JTm9kZSA9IElOb2RlO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1JTm9kZS5qcy5tYXAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./ts-out/NodeSystem/NodeCore/INode.js\n");

/***/ }),

/***/ "./ts-out/NodeSystem/NodeCore/NodeConfig.js":
/*!**************************************************!*\
  !*** ./ts-out/NodeSystem/NodeCore/NodeConfig.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nvar InterfaceValueType;\n\n(function (InterfaceValueType) {\n  InterfaceValueType[InterfaceValueType[\"number\"] = 0] = \"number\";\n  InterfaceValueType[InterfaceValueType[\"string\"] = 1] = \"string\";\n  InterfaceValueType[InterfaceValueType[\"boolean\"] = 2] = \"boolean\";\n})(InterfaceValueType = exports.InterfaceValueType || (exports.InterfaceValueType = {}));\n\nvar InterfaceType;\n\n(function (InterfaceType) {\n  InterfaceType[InterfaceType[\"input\"] = 0] = \"input\";\n  InterfaceType[InterfaceType[\"output\"] = 1] = \"output\";\n  InterfaceType[InterfaceType[\"uninitialized\"] = 2] = \"uninitialized\";\n})(InterfaceType = exports.InterfaceType || (exports.InterfaceType = {}));\n\nclass NodeConfig {\n  constructor() {\n    this.Name = \"NewNode\";\n    this.Description = \"Uninitialized\";\n    this.Inputs = [];\n    this.Outputs = [];\n  }\n\n}\n\nexports.NodeConfig = NodeConfig;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL05vZGVTeXN0ZW0vTm9kZUNvcmUvTm9kZUNvbmZpZy50cz84ZDAyIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsSUFBWSxrQkFBWjs7QUFBQSxXQUFZLGtCQUFaLEVBQThCO0FBQzFCO0FBQ0E7QUFDQTtBQUNILENBSkQsRUFBWSxrQkFBa0IsR0FBbEIsNERBQWtCLEVBQWxCLENBQVo7O0FBTUEsSUFBWSxhQUFaOztBQUFBLFdBQVksYUFBWixFQUF5QjtBQUNyQjtBQUNBO0FBQ0E7QUFDSCxDQUpELEVBQVksYUFBYSxHQUFiLGtEQUFhLEVBQWIsQ0FBWjs7QUFNQSxNQUFhLFVBQWIsQ0FBdUI7QUFBdkI7QUFDVyxnQkFBZSxTQUFmO0FBQ0EsdUJBQXNCLGVBQXRCO0FBQ0Esa0JBQTJCLEVBQTNCO0FBQ0EsbUJBQTRCLEVBQTVCO0FBQ1Y7O0FBTHNCOztBQUF2QiIsImZpbGUiOiIuL3RzLW91dC9Ob2RlU3lzdGVtL05vZGVDb3JlL05vZGVDb25maWcuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG52YXIgSW50ZXJmYWNlVmFsdWVUeXBlO1xyXG4oZnVuY3Rpb24gKEludGVyZmFjZVZhbHVlVHlwZSkge1xyXG4gICAgSW50ZXJmYWNlVmFsdWVUeXBlW0ludGVyZmFjZVZhbHVlVHlwZVtcIm51bWJlclwiXSA9IDBdID0gXCJudW1iZXJcIjtcclxuICAgIEludGVyZmFjZVZhbHVlVHlwZVtJbnRlcmZhY2VWYWx1ZVR5cGVbXCJzdHJpbmdcIl0gPSAxXSA9IFwic3RyaW5nXCI7XHJcbiAgICBJbnRlcmZhY2VWYWx1ZVR5cGVbSW50ZXJmYWNlVmFsdWVUeXBlW1wiYm9vbGVhblwiXSA9IDJdID0gXCJib29sZWFuXCI7XHJcbn0pKEludGVyZmFjZVZhbHVlVHlwZSA9IGV4cG9ydHMuSW50ZXJmYWNlVmFsdWVUeXBlIHx8IChleHBvcnRzLkludGVyZmFjZVZhbHVlVHlwZSA9IHt9KSk7XHJcbnZhciBJbnRlcmZhY2VUeXBlO1xyXG4oZnVuY3Rpb24gKEludGVyZmFjZVR5cGUpIHtcclxuICAgIEludGVyZmFjZVR5cGVbSW50ZXJmYWNlVHlwZVtcImlucHV0XCJdID0gMF0gPSBcImlucHV0XCI7XHJcbiAgICBJbnRlcmZhY2VUeXBlW0ludGVyZmFjZVR5cGVbXCJvdXRwdXRcIl0gPSAxXSA9IFwib3V0cHV0XCI7XHJcbiAgICBJbnRlcmZhY2VUeXBlW0ludGVyZmFjZVR5cGVbXCJ1bmluaXRpYWxpemVkXCJdID0gMl0gPSBcInVuaW5pdGlhbGl6ZWRcIjtcclxufSkoSW50ZXJmYWNlVHlwZSA9IGV4cG9ydHMuSW50ZXJmYWNlVHlwZSB8fCAoZXhwb3J0cy5JbnRlcmZhY2VUeXBlID0ge30pKTtcclxuY2xhc3MgTm9kZUNvbmZpZyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLk5hbWUgPSBcIk5ld05vZGVcIjtcclxuICAgICAgICB0aGlzLkRlc2NyaXB0aW9uID0gXCJVbmluaXRpYWxpemVkXCI7XHJcbiAgICAgICAgdGhpcy5JbnB1dHMgPSBbXTtcclxuICAgICAgICB0aGlzLk91dHB1dHMgPSBbXTtcclxuICAgIH1cclxufVxyXG5leHBvcnRzLk5vZGVDb25maWcgPSBOb2RlQ29uZmlnO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob2RlQ29uZmlnLmpzLm1hcCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./ts-out/NodeSystem/NodeCore/NodeConfig.js\n");

/***/ }),

/***/ "./ts-out/NodeSystem/NodeCore/NodeConnection.js":
/*!******************************************************!*\
  !*** ./ts-out/NodeSystem/NodeCore/NodeConnection.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n}); //Represents a connection between nodes \n// ____                             ____\n// |   |[IndexA]     |----->[IndexB]|   | \n// | A |[IndexA] ----|      [IndexB]| B |\n// |__ |[IndexA]                    |__ |\n//\n// isValid is used to determine if we need to evaluate NodeA[IndexA]\n// value wil hold the value outputted by IndexA\n\nclass NodeConnection {\n  constructor(nodeA, PortIndexA, NodeB, PortIndexB) {\n    this.PortIndexA = -1;\n    this.PortIndexB = -1;\n    this.NodeA = nodeA;\n    this.NodeB = NodeB;\n    this.PortIndexA = PortIndexA;\n    this.PortIndexB = PortIndexB;\n  }\n\n}\n\nexports.NodeConnection = NodeConnection;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL05vZGVTeXN0ZW0vTm9kZUNvcmUvTm9kZUNvbm5lY3Rpb24udHM/MTI3OCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0lBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFDQSxNQUFhLGNBQWIsQ0FBMkI7QUFPdkIsY0FBWSxLQUFaLEVBQTBCLFVBQTFCLEVBQTZDLEtBQTdDLEVBQTJELFVBQTNELEVBQTZFO0FBTHRFLHNCQUFxQixDQUFDLENBQXRCO0FBR0Esc0JBQXFCLENBQUMsQ0FBdEI7QUFHSCxTQUFLLEtBQUwsR0FBYSxLQUFiO0FBQ0EsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLFNBQUssVUFBTCxHQUFrQixVQUFsQjtBQUNBLFNBQUssVUFBTCxHQUFrQixVQUFsQjtBQUNIOztBQVpzQjs7QUFBM0IiLCJmaWxlIjoiLi90cy1vdXQvTm9kZVN5c3RlbS9Ob2RlQ29yZS9Ob2RlQ29ubmVjdGlvbi5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vUmVwcmVzZW50cyBhIGNvbm5lY3Rpb24gYmV0d2VlbiBub2RlcyBcclxuLy8gX19fXyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX19fX1xyXG4vLyB8ICAgfFtJbmRleEFdICAgICB8LS0tLS0+W0luZGV4Ql18ICAgfCBcclxuLy8gfCBBIHxbSW5kZXhBXSAtLS0tfCAgICAgIFtJbmRleEJdfCBCIHxcclxuLy8gfF9fIHxbSW5kZXhBXSAgICAgICAgICAgICAgICAgICAgfF9fIHxcclxuLy9cclxuLy8gaXNWYWxpZCBpcyB1c2VkIHRvIGRldGVybWluZSBpZiB3ZSBuZWVkIHRvIGV2YWx1YXRlIE5vZGVBW0luZGV4QV1cclxuLy8gdmFsdWUgd2lsIGhvbGQgdGhlIHZhbHVlIG91dHB1dHRlZCBieSBJbmRleEFcclxuY2xhc3MgTm9kZUNvbm5lY3Rpb24ge1xyXG4gICAgY29uc3RydWN0b3Iobm9kZUEsIFBvcnRJbmRleEEsIE5vZGVCLCBQb3J0SW5kZXhCKSB7XHJcbiAgICAgICAgdGhpcy5Qb3J0SW5kZXhBID0gLTE7XHJcbiAgICAgICAgdGhpcy5Qb3J0SW5kZXhCID0gLTE7XHJcbiAgICAgICAgdGhpcy5Ob2RlQSA9IG5vZGVBO1xyXG4gICAgICAgIHRoaXMuTm9kZUIgPSBOb2RlQjtcclxuICAgICAgICB0aGlzLlBvcnRJbmRleEEgPSBQb3J0SW5kZXhBO1xyXG4gICAgICAgIHRoaXMuUG9ydEluZGV4QiA9IFBvcnRJbmRleEI7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5Ob2RlQ29ubmVjdGlvbiA9IE5vZGVDb25uZWN0aW9uO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob2RlQ29ubmVjdGlvbi5qcy5tYXAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./ts-out/NodeSystem/NodeCore/NodeConnection.js\n");

/***/ }),

/***/ "./ts-out/NodeSystem/NodeCore/NodeGraph.js":
/*!*************************************************!*\
  !*** ./ts-out/NodeSystem/NodeCore/NodeGraph.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nclass NodeGraph {\n  //Connections: NodeConnection[];\n  //Add some maps to efficently find connected nodes\n  constructor() {\n    this.Nodes = [];\n  } //Returns the index of this node\n\n\n  AddNode(node) {\n    if (node.graph == null) {\n      let index = this.Nodes.push(node) - 1;\n      node.index = index;\n      node.graph = this;\n      return index;\n    } //Node is already in another graph\n\n\n    return -1;\n  }\n\n  EvaluateAll() {\n    for (let i = 0; i < this.Nodes.length; i++) {\n      //If a node doesn't have a connected output, evaluate it. (the rest is evaluated recursively as needed)\n      if (!this.Nodes[i].HasConnectedOuput()) this.Nodes[i].EvaluateNode();\n    }\n  }\n\n}\n\nexports.NodeGraph = NodeGraph;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL05vZGVTeXN0ZW0vTm9kZUNvcmUvTm9kZUdyYXBoLnRzPzI0ZDkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsTUFBYSxTQUFiLENBQXNCO0FBRWxCO0FBQ0E7QUFFQTtBQUNJLFNBQUssS0FBTCxHQUFhLEVBQWI7QUFDSCxHQVBpQixDQVNsQjs7O0FBQ08sU0FBTyxDQUFDLElBQUQsRUFBVztBQUVyQixRQUFHLElBQUksQ0FBQyxLQUFMLElBQWMsSUFBakIsRUFBc0I7QUFDbEIsVUFBSSxLQUFLLEdBQUcsS0FBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQixJQUF3QixDQUFwQztBQUNBLFVBQUksQ0FBQyxLQUFMLEdBQWEsS0FBYjtBQUNBLFVBQUksQ0FBQyxLQUFMLEdBQWEsSUFBYjtBQUVBLGFBQU8sS0FBUDtBQUNILEtBUm9CLENBVXJCOzs7QUFDQSxXQUFPLENBQUMsQ0FBUjtBQUNIOztBQUVNLGFBQVc7QUFFZCxTQUFJLElBQUksQ0FBQyxHQUFHLENBQVosRUFBZSxDQUFDLEdBQUUsS0FBSyxLQUFMLENBQVcsTUFBN0IsRUFBcUMsQ0FBQyxFQUF0QyxFQUNBO0FBQ0k7QUFDQSxVQUFHLENBQUMsS0FBSyxLQUFMLENBQVcsQ0FBWCxFQUFjLGlCQUFkLEVBQUosRUFDSSxLQUFLLEtBQUwsQ0FBVyxDQUFYLEVBQWMsWUFBZDtBQUNQO0FBQ0o7O0FBaENpQjs7QUFBdEIiLCJmaWxlIjoiLi90cy1vdXQvTm9kZVN5c3RlbS9Ob2RlQ29yZS9Ob2RlR3JhcGguanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jbGFzcyBOb2RlR3JhcGgge1xyXG4gICAgLy9Db25uZWN0aW9uczogTm9kZUNvbm5lY3Rpb25bXTtcclxuICAgIC8vQWRkIHNvbWUgbWFwcyB0byBlZmZpY2VudGx5IGZpbmQgY29ubmVjdGVkIG5vZGVzXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLk5vZGVzID0gW107XHJcbiAgICB9XHJcbiAgICAvL1JldHVybnMgdGhlIGluZGV4IG9mIHRoaXMgbm9kZVxyXG4gICAgQWRkTm9kZShub2RlKSB7XHJcbiAgICAgICAgaWYgKG5vZGUuZ3JhcGggPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLk5vZGVzLnB1c2gobm9kZSkgLSAxO1xyXG4gICAgICAgICAgICBub2RlLmluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgICAgIG5vZGUuZ3JhcGggPSB0aGlzO1xyXG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vTm9kZSBpcyBhbHJlYWR5IGluIGFub3RoZXIgZ3JhcGhcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcbiAgICBFdmFsdWF0ZUFsbCgpIHtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgLy9JZiBhIG5vZGUgZG9lc24ndCBoYXZlIGEgY29ubmVjdGVkIG91dHB1dCwgZXZhbHVhdGUgaXQuICh0aGUgcmVzdCBpcyBldmFsdWF0ZWQgcmVjdXJzaXZlbHkgYXMgbmVlZGVkKVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuTm9kZXNbaV0uSGFzQ29ubmVjdGVkT3VwdXQoKSlcclxuICAgICAgICAgICAgICAgIHRoaXMuTm9kZXNbaV0uRXZhbHVhdGVOb2RlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTm9kZUdyYXBoID0gTm9kZUdyYXBoO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob2RlR3JhcGguanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./ts-out/NodeSystem/NodeCore/NodeGraph.js\n");

/***/ }),

/***/ "./ts-out/NodeSystem/NodeCore/NodePort.js":
/*!************************************************!*\
  !*** ./ts-out/NodeSystem/NodeCore/NodePort.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nclass NodePort {\n  constructor() {\n    //node:INode; <- not needed as of yet\n    this.connection = null;\n    this.isValid = false;\n  }\n\n}\n\nexports.NodePort = NodePort;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL05vZGVTeXN0ZW0vTm9kZUNvcmUvTm9kZVBvcnQudHM/ZjNiMyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxNQUFhLFFBQWIsQ0FBcUI7QUFBckI7QUFDSTtBQUNBLHNCQUFvQyxJQUFwQztBQUVPLG1CQUFtQixLQUFuQjtBQUVWOztBQU5vQjs7QUFBckIiLCJmaWxlIjoiLi90cy1vdXQvTm9kZVN5c3RlbS9Ob2RlQ29yZS9Ob2RlUG9ydC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNsYXNzIE5vZGVQb3J0IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vbm9kZTpJTm9kZTsgPC0gbm90IG5lZWRlZCBhcyBvZiB5ZXRcclxuICAgICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xyXG4gICAgICAgIHRoaXMuaXNWYWxpZCA9IGZhbHNlO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuTm9kZVBvcnQgPSBOb2RlUG9ydDtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Tm9kZVBvcnQuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./ts-out/NodeSystem/NodeCore/NodePort.js\n");

/***/ }),

/***/ "./ts-out/NodeSystem/NodeCore/NodePortConfig.js":
/*!******************************************************!*\
  !*** ./ts-out/NodeSystem/NodeCore/NodePortConfig.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nconst NodeConfig_1 = __webpack_require__(/*! ./NodeConfig */ \"./ts-out/NodeSystem/NodeCore/NodeConfig.js\");\n\nclass NodePortConfig {\n  constructor(name, valuetype) {\n    this.Type = NodeConfig_1.InterfaceType.uninitialized;\n    this.Name = name;\n    this.ValueType = valuetype; // int, float ect..\n  }\n\n}\n\nexports.NodePortConfig = NodePortConfig;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL05vZGVTeXN0ZW0vTm9kZUNvcmUvTm9kZVBvcnRDb25maWcudHM/MzRlNCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFHQSxNQUFhLGNBQWIsQ0FBMkI7QUFLdkIsY0FBWSxJQUFaLEVBQTBCLFNBQTFCLEVBQXNEO0FBQ2xELFNBQUssSUFBTCxHQUFZLDJCQUFjLGFBQTFCO0FBQ0EsU0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFNBQUssU0FBTCxHQUFpQixTQUFqQixDQUhrRCxDQUd0QjtBQUMvQjs7QUFUc0I7O0FBQTNCIiwiZmlsZSI6Ii4vdHMtb3V0L05vZGVTeXN0ZW0vTm9kZUNvcmUvTm9kZVBvcnRDb25maWcuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5jb25zdCBOb2RlQ29uZmlnXzEgPSByZXF1aXJlKFwiLi9Ob2RlQ29uZmlnXCIpO1xyXG5jbGFzcyBOb2RlUG9ydENvbmZpZyB7XHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lLCB2YWx1ZXR5cGUpIHtcclxuICAgICAgICB0aGlzLlR5cGUgPSBOb2RlQ29uZmlnXzEuSW50ZXJmYWNlVHlwZS51bmluaXRpYWxpemVkO1xyXG4gICAgICAgIHRoaXMuTmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5WYWx1ZVR5cGUgPSB2YWx1ZXR5cGU7IC8vIGludCwgZmxvYXQgZWN0Li5cclxuICAgIH1cclxufVxyXG5leHBvcnRzLk5vZGVQb3J0Q29uZmlnID0gTm9kZVBvcnRDb25maWc7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU5vZGVQb3J0Q29uZmlnLmpzLm1hcCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./ts-out/NodeSystem/NodeCore/NodePortConfig.js\n");

/***/ }),

/***/ "./ts-out/NodeSystem/NodeCore/index.js":
/*!*********************************************!*\
  !*** ./ts-out/NodeSystem/NodeCore/index.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar NodeConfig_1 = __webpack_require__(/*! ../NodeCore/NodeConfig */ \"./ts-out/NodeSystem/NodeCore/NodeConfig.js\");\n\nexports.InterfaceType = NodeConfig_1.InterfaceType;\nexports.InterfaceValueType = NodeConfig_1.InterfaceValueType;\nexports.NodeConfig = NodeConfig_1.NodeConfig;\n\nvar INode_1 = __webpack_require__(/*! ./INode */ \"./ts-out/NodeSystem/NodeCore/INode.js\");\n\nexports.INode = INode_1.INode;\n\nvar NodeConnection_1 = __webpack_require__(/*! ./NodeConnection */ \"./ts-out/NodeSystem/NodeCore/NodeConnection.js\");\n\nexports.NodeConnection = NodeConnection_1.NodeConnection;\n\nvar NodeGraph_1 = __webpack_require__(/*! ./NodeGraph */ \"./ts-out/NodeSystem/NodeCore/NodeGraph.js\");\n\nexports.NodeGraph = NodeGraph_1.NodeGraph;\n\nvar NodePortConfig_1 = __webpack_require__(/*! ./NodePortConfig */ \"./ts-out/NodeSystem/NodeCore/NodePortConfig.js\");\n\nexports.NodePortConfig = NodePortConfig_1.NodePortConfig;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL05vZGVTeXN0ZW0vTm9kZUNvcmUvaW5kZXgudHM/NTRmMiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFBUztBQUFlO0FBQW9COztBQUM1Qzs7QUFBUzs7QUFDVDs7QUFBUzs7QUFDVDs7QUFBUzs7QUFDVDs7QUFBUyIsImZpbGUiOiIuL3RzLW91dC9Ob2RlU3lzdGVtL05vZGVDb3JlL2luZGV4LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxudmFyIE5vZGVDb25maWdfMSA9IHJlcXVpcmUoXCIuLi9Ob2RlQ29yZS9Ob2RlQ29uZmlnXCIpO1xyXG5leHBvcnRzLkludGVyZmFjZVR5cGUgPSBOb2RlQ29uZmlnXzEuSW50ZXJmYWNlVHlwZTtcclxuZXhwb3J0cy5JbnRlcmZhY2VWYWx1ZVR5cGUgPSBOb2RlQ29uZmlnXzEuSW50ZXJmYWNlVmFsdWVUeXBlO1xyXG5leHBvcnRzLk5vZGVDb25maWcgPSBOb2RlQ29uZmlnXzEuTm9kZUNvbmZpZztcclxudmFyIElOb2RlXzEgPSByZXF1aXJlKFwiLi9JTm9kZVwiKTtcclxuZXhwb3J0cy5JTm9kZSA9IElOb2RlXzEuSU5vZGU7XHJcbnZhciBOb2RlQ29ubmVjdGlvbl8xID0gcmVxdWlyZShcIi4vTm9kZUNvbm5lY3Rpb25cIik7XHJcbmV4cG9ydHMuTm9kZUNvbm5lY3Rpb24gPSBOb2RlQ29ubmVjdGlvbl8xLk5vZGVDb25uZWN0aW9uO1xyXG52YXIgTm9kZUdyYXBoXzEgPSByZXF1aXJlKFwiLi9Ob2RlR3JhcGhcIik7XHJcbmV4cG9ydHMuTm9kZUdyYXBoID0gTm9kZUdyYXBoXzEuTm9kZUdyYXBoO1xyXG52YXIgTm9kZVBvcnRDb25maWdfMSA9IHJlcXVpcmUoXCIuL05vZGVQb3J0Q29uZmlnXCIpO1xyXG5leHBvcnRzLk5vZGVQb3J0Q29uZmlnID0gTm9kZVBvcnRDb25maWdfMS5Ob2RlUG9ydENvbmZpZztcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW5kZXguanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./ts-out/NodeSystem/NodeCore/index.js\n");

/***/ }),

/***/ "./ts-out/NodeSystem/Nodes/AddNode.js":
/*!********************************************!*\
  !*** ./ts-out/NodeSystem/Nodes/AddNode.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n}); // import { INode } from \"../NodeCore/INode\";\n// import { InterfaceType, InterfaceValueType, NodeConfig } from \"../NodeCore/NodeConfig\";\n\nconst NodeCore_1 = __webpack_require__(/*! ../NodeCore */ \"./ts-out/NodeSystem/NodeCore/index.js\");\n\nclass AddNode extends NodeCore_1.INode {\n  constructor() {\n    var cfg = {\n      Name: \"Add node\",\n      Description: \"Adds inputs together\",\n      Inputs: [{\n        Name: \"A\",\n        Type: NodeCore_1.InterfaceType.input,\n        ValueType: NodeCore_1.InterfaceValueType.number\n      }, {\n        Name: \"B\",\n        Type: NodeCore_1.InterfaceType.input,\n        ValueType: NodeCore_1.InterfaceValueType.number\n      }],\n      Outputs: [{\n        Name: \"O\",\n        Type: NodeCore_1.InterfaceType.output,\n        ValueType: NodeCore_1.InterfaceValueType.number\n      }]\n    };\n    super(cfg);\n  }\n\n  GetValue(outPortNumber) {\n    if (outPortNumber == 0) {\n      return this.GetInput(0).value + this.GetInput(1).value;\n    }\n  }\n\n}\n\nexports.AddNode = AddNode;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL05vZGVTeXN0ZW0vTm9kZXMvQWRkTm9kZS50cz8yNzkyIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFBQTtBQUNBOztBQUNBOztBQUVBLE1BQWEsT0FBYixTQUE2QixnQkFBN0IsQ0FBa0M7QUFDOUI7QUFFSSxRQUFJLEdBQUcsR0FBZTtBQUNsQixVQUFJLEVBQUUsVUFEWTtBQUVsQixpQkFBVyxFQUFFLHNCQUZLO0FBR2xCLFlBQU0sRUFBRSxDQUNKO0FBQUMsWUFBSSxFQUFFLEdBQVA7QUFBWSxZQUFJLEVBQUUseUJBQWMsS0FBaEM7QUFBdUMsaUJBQVMsRUFBRSw4QkFBbUI7QUFBckUsT0FESSxFQUVKO0FBQUMsWUFBSSxFQUFFLEdBQVA7QUFBWSxZQUFJLEVBQUUseUJBQWMsS0FBaEM7QUFBdUMsaUJBQVMsRUFBRSw4QkFBbUI7QUFBckUsT0FGSSxDQUhVO0FBT2xCLGFBQU8sRUFBRSxDQUNMO0FBQUMsWUFBSSxFQUFFLEdBQVA7QUFBWSxZQUFJLEVBQUUseUJBQWMsTUFBaEM7QUFBd0MsaUJBQVMsRUFBRSw4QkFBbUI7QUFBdEUsT0FESztBQVBTLEtBQXRCO0FBV0EsVUFBTSxHQUFOO0FBQ0g7O0FBRVMsVUFBUSxDQUFDLGFBQUQsRUFBc0I7QUFDcEMsUUFBRyxhQUFhLElBQUksQ0FBcEIsRUFBc0I7QUFDbEIsYUFBTyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEVBQWlCLEtBQWpCLEdBQXlCLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsS0FBakQ7QUFDSDtBQUNKOztBQXJCNkI7O0FBQWxDIiwiZmlsZSI6Ii4vdHMtb3V0L05vZGVTeXN0ZW0vTm9kZXMvQWRkTm9kZS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vIGltcG9ydCB7IElOb2RlIH0gZnJvbSBcIi4uL05vZGVDb3JlL0lOb2RlXCI7XHJcbi8vIGltcG9ydCB7IEludGVyZmFjZVR5cGUsIEludGVyZmFjZVZhbHVlVHlwZSwgTm9kZUNvbmZpZyB9IGZyb20gXCIuLi9Ob2RlQ29yZS9Ob2RlQ29uZmlnXCI7XHJcbmNvbnN0IE5vZGVDb3JlXzEgPSByZXF1aXJlKFwiLi4vTm9kZUNvcmVcIik7XHJcbmNsYXNzIEFkZE5vZGUgZXh0ZW5kcyBOb2RlQ29yZV8xLklOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHZhciBjZmcgPSB7XHJcbiAgICAgICAgICAgIE5hbWU6IFwiQWRkIG5vZGVcIixcclxuICAgICAgICAgICAgRGVzY3JpcHRpb246IFwiQWRkcyBpbnB1dHMgdG9nZXRoZXJcIixcclxuICAgICAgICAgICAgSW5wdXRzOiBbXHJcbiAgICAgICAgICAgICAgICB7IE5hbWU6IFwiQVwiLCBUeXBlOiBOb2RlQ29yZV8xLkludGVyZmFjZVR5cGUuaW5wdXQsIFZhbHVlVHlwZTogTm9kZUNvcmVfMS5JbnRlcmZhY2VWYWx1ZVR5cGUubnVtYmVyIH0sXHJcbiAgICAgICAgICAgICAgICB7IE5hbWU6IFwiQlwiLCBUeXBlOiBOb2RlQ29yZV8xLkludGVyZmFjZVR5cGUuaW5wdXQsIFZhbHVlVHlwZTogTm9kZUNvcmVfMS5JbnRlcmZhY2VWYWx1ZVR5cGUubnVtYmVyIH0sXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIE91dHB1dHM6IFtcclxuICAgICAgICAgICAgICAgIHsgTmFtZTogXCJPXCIsIFR5cGU6IE5vZGVDb3JlXzEuSW50ZXJmYWNlVHlwZS5vdXRwdXQsIFZhbHVlVHlwZTogTm9kZUNvcmVfMS5JbnRlcmZhY2VWYWx1ZVR5cGUubnVtYmVyIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgc3VwZXIoY2ZnKTtcclxuICAgIH1cclxuICAgIEdldFZhbHVlKG91dFBvcnROdW1iZXIpIHtcclxuICAgICAgICBpZiAob3V0UG9ydE51bWJlciA9PSAwKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLkdldElucHV0KDApLnZhbHVlICsgdGhpcy5HZXRJbnB1dCgxKS52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5BZGROb2RlID0gQWRkTm9kZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QWRkTm9kZS5qcy5tYXAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./ts-out/NodeSystem/Nodes/AddNode.js\n");

/***/ }),

/***/ "./ts-out/NodeSystem/Nodes/ConstantNumberNode.js":
/*!*******************************************************!*\
  !*** ./ts-out/NodeSystem/Nodes/ConstantNumberNode.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n}); // import { INode } from \"../NodeCore/INode\";\n// import { InterfaceType, InterfaceValueType, NodeConfig } from \"../NodeCore/NodeConfig\";\n\nconst NodeCore_1 = __webpack_require__(/*! ../NodeCore */ \"./ts-out/NodeSystem/NodeCore/index.js\");\n\nclass ConstantNumberNode extends NodeCore_1.INode {\n  constructor(value) {\n    var cfg = {\n      Name: \"Constant number node\",\n      Description: \"Output's a constant number\",\n      Inputs: [],\n      Outputs: [{\n        Name: \"O\",\n        Type: NodeCore_1.InterfaceType.output,\n        ValueType: NodeCore_1.InterfaceValueType.number\n      }]\n    };\n    super(cfg);\n    this.value = value;\n  }\n\n  GetValue(outPortNumber) {\n    if (outPortNumber == 0) {\n      return this.value;\n    }\n  }\n\n}\n\nexports.ConstantNumberNode = ConstantNumberNode;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL05vZGVTeXN0ZW0vTm9kZXMvQ29uc3RhbnROdW1iZXJOb2RlLnRzPzkyZjYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUFBO0FBQ0E7O0FBQ0E7O0FBRUEsTUFBYSxrQkFBYixTQUF3QyxnQkFBeEMsQ0FBNkM7QUFHekMsY0FBWSxLQUFaLEVBQXlCO0FBRXJCLFFBQUksR0FBRyxHQUFlO0FBQ2xCLFVBQUksRUFBRSxzQkFEWTtBQUVsQixpQkFBVyxFQUFFLDRCQUZLO0FBR2xCLFlBQU0sRUFBRSxFQUhVO0FBSWxCLGFBQU8sRUFBRSxDQUNMO0FBQUMsWUFBSSxFQUFFLEdBQVA7QUFBWSxZQUFJLEVBQUUseUJBQWMsTUFBaEM7QUFBd0MsaUJBQVMsRUFBRSw4QkFBbUI7QUFBdEUsT0FESztBQUpTLEtBQXRCO0FBUUEsVUFBTSxHQUFOO0FBRUEsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNIOztBQUVTLFVBQVEsQ0FBQyxhQUFELEVBQXNCO0FBQ3BDLFFBQUcsYUFBYSxJQUFJLENBQXBCLEVBQXNCO0FBQ2xCLGFBQU8sS0FBSyxLQUFaO0FBQ0g7QUFDSjs7QUF0QndDOztBQUE3QyIsImZpbGUiOiIuL3RzLW91dC9Ob2RlU3lzdGVtL05vZGVzL0NvbnN0YW50TnVtYmVyTm9kZS5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbi8vIGltcG9ydCB7IElOb2RlIH0gZnJvbSBcIi4uL05vZGVDb3JlL0lOb2RlXCI7XHJcbi8vIGltcG9ydCB7IEludGVyZmFjZVR5cGUsIEludGVyZmFjZVZhbHVlVHlwZSwgTm9kZUNvbmZpZyB9IGZyb20gXCIuLi9Ob2RlQ29yZS9Ob2RlQ29uZmlnXCI7XHJcbmNvbnN0IE5vZGVDb3JlXzEgPSByZXF1aXJlKFwiLi4vTm9kZUNvcmVcIik7XHJcbmNsYXNzIENvbnN0YW50TnVtYmVyTm9kZSBleHRlbmRzIE5vZGVDb3JlXzEuSU5vZGUge1xyXG4gICAgY29uc3RydWN0b3IodmFsdWUpIHtcclxuICAgICAgICB2YXIgY2ZnID0ge1xyXG4gICAgICAgICAgICBOYW1lOiBcIkNvbnN0YW50IG51bWJlciBub2RlXCIsXHJcbiAgICAgICAgICAgIERlc2NyaXB0aW9uOiBcIk91dHB1dCdzIGEgY29uc3RhbnQgbnVtYmVyXCIsXHJcbiAgICAgICAgICAgIElucHV0czogW10sXHJcbiAgICAgICAgICAgIE91dHB1dHM6IFtcclxuICAgICAgICAgICAgICAgIHsgTmFtZTogXCJPXCIsIFR5cGU6IE5vZGVDb3JlXzEuSW50ZXJmYWNlVHlwZS5vdXRwdXQsIFZhbHVlVHlwZTogTm9kZUNvcmVfMS5JbnRlcmZhY2VWYWx1ZVR5cGUubnVtYmVyIH1cclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgc3VwZXIoY2ZnKTtcclxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBHZXRWYWx1ZShvdXRQb3J0TnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKG91dFBvcnROdW1iZXIgPT0gMCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5Db25zdGFudE51bWJlck5vZGUgPSBDb25zdGFudE51bWJlck5vZGU7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbnN0YW50TnVtYmVyTm9kZS5qcy5tYXAiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./ts-out/NodeSystem/Nodes/ConstantNumberNode.js\n");

/***/ }),

/***/ "./ts-out/NodeSystem/Nodes/MultiplyNode.js":
/*!*************************************************!*\
  !*** ./ts-out/NodeSystem/Nodes/MultiplyNode.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n}); // import { INode } from \"../NodeCore/INode\";\n// import { InterfaceType, InterfaceValueType, NodeConfig } from \"../NodeCore/NodeConfig\";\n\nconst NodeCore_1 = __webpack_require__(/*! ../NodeCore */ \"./ts-out/NodeSystem/NodeCore/index.js\");\n\nclass MultiplyNode extends NodeCore_1.INode {\n  constructor() {\n    var cfg = {\n      Name: \"Multiply node\",\n      Description: \"Multiplies inputs\",\n      Inputs: [{\n        Name: \"A\",\n        Type: NodeCore_1.InterfaceType.input,\n        ValueType: NodeCore_1.InterfaceValueType.number\n      }, {\n        Name: \"B\",\n        Type: NodeCore_1.InterfaceType.input,\n        ValueType: NodeCore_1.InterfaceValueType.number\n      }],\n      Outputs: [{\n        Name: \"O\",\n        Type: NodeCore_1.InterfaceType.output,\n        ValueType: NodeCore_1.InterfaceValueType.number\n      }]\n    };\n    super(cfg);\n  }\n\n  GetValue(outPortNumber) {\n    if (outPortNumber == 0) {\n      return this.GetInput(0).value * this.GetInput(1).value;\n    }\n  }\n\n}\n\nexports.MultiplyNode = MultiplyNode;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vLi4vc3JjL05vZGVTeXN0ZW0vTm9kZXMvTXVsdGlwbHlOb2RlLnRzPzU2NDIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUFBO0FBQ0E7O0FBQ0E7O0FBRUEsTUFBYSxZQUFiLFNBQWtDLGdCQUFsQyxDQUF1QztBQUNuQztBQUVJLFFBQUksR0FBRyxHQUFlO0FBQ2xCLFVBQUksRUFBRSxlQURZO0FBRWxCLGlCQUFXLEVBQUUsbUJBRks7QUFHbEIsWUFBTSxFQUFFLENBQ0o7QUFBQyxZQUFJLEVBQUUsR0FBUDtBQUFZLFlBQUksRUFBRSx5QkFBYyxLQUFoQztBQUF1QyxpQkFBUyxFQUFFLDhCQUFtQjtBQUFyRSxPQURJLEVBRUo7QUFBQyxZQUFJLEVBQUUsR0FBUDtBQUFZLFlBQUksRUFBRSx5QkFBYyxLQUFoQztBQUF1QyxpQkFBUyxFQUFFLDhCQUFtQjtBQUFyRSxPQUZJLENBSFU7QUFPbEIsYUFBTyxFQUFFLENBQ0w7QUFBQyxZQUFJLEVBQUUsR0FBUDtBQUFZLFlBQUksRUFBRSx5QkFBYyxNQUFoQztBQUF3QyxpQkFBUyxFQUFFLDhCQUFtQjtBQUF0RSxPQURLO0FBUFMsS0FBdEI7QUFXQSxVQUFNLEdBQU47QUFDSDs7QUFFUyxVQUFRLENBQUMsYUFBRCxFQUFzQjtBQUNwQyxRQUFHLGFBQWEsSUFBSSxDQUFwQixFQUFzQjtBQUNsQixhQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsRUFBaUIsS0FBakIsR0FBeUIsS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixLQUFqRDtBQUNIO0FBQ0o7O0FBckJrQzs7QUFBdkMiLCJmaWxlIjoiLi90cy1vdXQvTm9kZVN5c3RlbS9Ob2Rlcy9NdWx0aXBseU5vZGUuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG4vLyBpbXBvcnQgeyBJTm9kZSB9IGZyb20gXCIuLi9Ob2RlQ29yZS9JTm9kZVwiO1xyXG4vLyBpbXBvcnQgeyBJbnRlcmZhY2VUeXBlLCBJbnRlcmZhY2VWYWx1ZVR5cGUsIE5vZGVDb25maWcgfSBmcm9tIFwiLi4vTm9kZUNvcmUvTm9kZUNvbmZpZ1wiO1xyXG5jb25zdCBOb2RlQ29yZV8xID0gcmVxdWlyZShcIi4uL05vZGVDb3JlXCIpO1xyXG5jbGFzcyBNdWx0aXBseU5vZGUgZXh0ZW5kcyBOb2RlQ29yZV8xLklOb2RlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHZhciBjZmcgPSB7XHJcbiAgICAgICAgICAgIE5hbWU6IFwiTXVsdGlwbHkgbm9kZVwiLFxyXG4gICAgICAgICAgICBEZXNjcmlwdGlvbjogXCJNdWx0aXBsaWVzIGlucHV0c1wiLFxyXG4gICAgICAgICAgICBJbnB1dHM6IFtcclxuICAgICAgICAgICAgICAgIHsgTmFtZTogXCJBXCIsIFR5cGU6IE5vZGVDb3JlXzEuSW50ZXJmYWNlVHlwZS5pbnB1dCwgVmFsdWVUeXBlOiBOb2RlQ29yZV8xLkludGVyZmFjZVZhbHVlVHlwZS5udW1iZXIgfSxcclxuICAgICAgICAgICAgICAgIHsgTmFtZTogXCJCXCIsIFR5cGU6IE5vZGVDb3JlXzEuSW50ZXJmYWNlVHlwZS5pbnB1dCwgVmFsdWVUeXBlOiBOb2RlQ29yZV8xLkludGVyZmFjZVZhbHVlVHlwZS5udW1iZXIgfSxcclxuICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgT3V0cHV0czogW1xyXG4gICAgICAgICAgICAgICAgeyBOYW1lOiBcIk9cIiwgVHlwZTogTm9kZUNvcmVfMS5JbnRlcmZhY2VUeXBlLm91dHB1dCwgVmFsdWVUeXBlOiBOb2RlQ29yZV8xLkludGVyZmFjZVZhbHVlVHlwZS5udW1iZXIgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfTtcclxuICAgICAgICBzdXBlcihjZmcpO1xyXG4gICAgfVxyXG4gICAgR2V0VmFsdWUob3V0UG9ydE51bWJlcikge1xyXG4gICAgICAgIGlmIChvdXRQb3J0TnVtYmVyID09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuR2V0SW5wdXQoMCkudmFsdWUgKiB0aGlzLkdldElucHV0KDEpLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5leHBvcnRzLk11bHRpcGx5Tm9kZSA9IE11bHRpcGx5Tm9kZTtcclxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9TXVsdGlwbHlOb2RlLmpzLm1hcCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./ts-out/NodeSystem/Nodes/MultiplyNode.js\n");

/***/ }),

/***/ "./ts-out/app.js":
/*!***********************!*\
  !*** ./ts-out/app.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar __importDefault = this && this.__importDefault || function (mod) {\n  return mod && mod.__esModule ? mod : {\n    \"default\": mod\n  };\n};\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nconst pixi_js_1 = __webpack_require__(/*! pixi.js */ \"pixi.js\");\n\nconst Character_1 = __importDefault(__webpack_require__(/*! ./app/Character */ \"./ts-out/app/Character.js\"));\n\nconst NodeGraphRenderer_1 = __webpack_require__(/*! ./NodeRendererPixijs/NodeGraphRenderer */ \"./ts-out/NodeRendererPixijs/NodeGraphRenderer.js\");\n\nconst NodeCore_1 = __webpack_require__(/*! ./NodeSystem/NodeCore */ \"./ts-out/NodeSystem/NodeCore/index.js\");\n\nconst AddNode_1 = __webpack_require__(/*! ./NodeSystem/Nodes/AddNode */ \"./ts-out/NodeSystem/Nodes/AddNode.js\");\n\nconst ConstantNumberNode_1 = __webpack_require__(/*! ./NodeSystem/Nodes/ConstantNumberNode */ \"./ts-out/NodeSystem/Nodes/ConstantNumberNode.js\");\n\nconst MultiplyNode_1 = __webpack_require__(/*! ./NodeSystem/Nodes/MultiplyNode */ \"./ts-out/NodeSystem/Nodes/MultiplyNode.js\");\n\nconst loader = pixi_js_1.Loader.shared;\n\nclass Game {\n  constructor() {\n    // instantiate app\n    this.app = new pixi_js_1.Application({\n      width: 512,\n      height: 512,\n      backgroundColor: 0x1099bb\n    }); // create view in DOM\n\n    document.body.appendChild(this.app.view); // preload needed assets\n\n    loader.add('samir', '/assets/img/hero.png'); // then launch app on loader ready\n\n    loader.load(this.setup.bind(this));\n  } //DEBUG FUNCTION\n\n\n  generate_test_graph() {\n    let Graph = new NodeCore_1.NodeGraph();\n    var cn1 = new ConstantNumberNode_1.ConstantNumberNode(2.5);\n    var cn2 = new ConstantNumberNode_1.ConstantNumberNode(3.5);\n    var an = new AddNode_1.AddNode();\n    var cn3 = new ConstantNumberNode_1.ConstantNumberNode(6.5);\n    var an2 = new MultiplyNode_1.MultiplyNode();\n    Graph.AddNode(cn1);\n    Graph.AddNode(cn2);\n    Graph.AddNode(an);\n    Graph.AddNode(cn3);\n    Graph.AddNode(an2);\n    cn1.Connect(0, 0, an);\n    cn2.Connect(0, 1, an);\n    cn3.Connect(0, 0, an2);\n    an.Connect(0, 1, an2); //an2.EvaluateNode();\n\n    Graph.EvaluateAll();\n    return Graph;\n  } //\n\n\n  setup() {\n    // append hero\n    const hero = new Character_1.default(loader.resources.samir.texture);\n    this.app.stage.addChild(hero.sprite);\n    hero.setTopPosition(256);\n    const nodeRenderer = new NodeGraphRenderer_1.NodeGraphRenderer(this.generate_test_graph());\n    this.app.stage.addChild(nodeRenderer); //  animate hero\n\n    this.app.ticker.add(() => {\n      nodeRenderer.x += 0.05;\n\n      if (hero.sprite.x >= this.app.view.width) {\n        hero.direction = 'left';\n      } else if (hero.sprite.x < 0) {\n        hero.direction = 'right';\n      }\n\n      hero.move();\n    });\n  }\n\n} // eslint-disable-next-line no-new\n\n\nnew Game();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vc3JjL2FwcC50cz9mNzE1Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBLE1BQU0sTUFBTSxHQUFHLGlCQUFPLE1BQXRCOztBQUNBLE1BQU0sSUFBTixDQUFVO0FBR1I7QUFDRTtBQUNBLFNBQUssR0FBTCxHQUFXLElBQUkscUJBQUosQ0FBZ0I7QUFDekIsV0FBSyxFQUFFLEdBRGtCO0FBRXpCLFlBQU0sRUFBRSxHQUZpQjtBQUd6QixxQkFBZSxFQUFFO0FBSFEsS0FBaEIsQ0FBWCxDQUZGLENBUUU7O0FBQ0EsWUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLEtBQUssR0FBTCxDQUFTLElBQW5DLEVBVEYsQ0FXRTs7QUFDQSxVQUFNLENBQUMsR0FBUCxDQUFXLE9BQVgsRUFBb0Isc0JBQXBCLEVBWkYsQ0FjRTs7QUFDQSxVQUFNLENBQUMsSUFBUCxDQUFZLEtBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEIsQ0FBWjtBQUNELEdBbkJPLENBcUJSOzs7QUFDQSxxQkFBbUI7QUFFakIsUUFBSSxLQUFLLEdBQWMsSUFBSSxvQkFBSixFQUF2QjtBQUNBLFFBQUksR0FBRyxHQUFHLElBQUksdUNBQUosQ0FBdUIsR0FBdkIsQ0FBVjtBQUNBLFFBQUksR0FBRyxHQUFHLElBQUksdUNBQUosQ0FBdUIsR0FBdkIsQ0FBVjtBQUNBLFFBQUksRUFBRSxHQUFHLElBQUksaUJBQUosRUFBVDtBQUNBLFFBQUksR0FBRyxHQUFHLElBQUksdUNBQUosQ0FBdUIsR0FBdkIsQ0FBVjtBQUNBLFFBQUksR0FBRyxHQUFHLElBQUksMkJBQUosRUFBVjtBQUNBLFNBQUssQ0FBQyxPQUFOLENBQWMsR0FBZDtBQUNBLFNBQUssQ0FBQyxPQUFOLENBQWMsR0FBZDtBQUNBLFNBQUssQ0FBQyxPQUFOLENBQWMsRUFBZDtBQUNBLFNBQUssQ0FBQyxPQUFOLENBQWMsR0FBZDtBQUNBLFNBQUssQ0FBQyxPQUFOLENBQWMsR0FBZDtBQUVBLE9BQUcsQ0FBQyxPQUFKLENBQVksQ0FBWixFQUFlLENBQWYsRUFBa0IsRUFBbEI7QUFDQSxPQUFHLENBQUMsT0FBSixDQUFZLENBQVosRUFBZSxDQUFmLEVBQWtCLEVBQWxCO0FBQ0EsT0FBRyxDQUFDLE9BQUosQ0FBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQixHQUFsQjtBQUNBLE1BQUUsQ0FBQyxPQUFILENBQVcsQ0FBWCxFQUFhLENBQWIsRUFBZSxHQUFmLEVBakJpQixDQW1CakI7O0FBQ0EsU0FBSyxDQUFDLFdBQU47QUFFQSxXQUFPLEtBQVA7QUFDRCxHQTdDTyxDQThDUjs7O0FBRUEsT0FBSztBQUNIO0FBQ0EsVUFBTSxJQUFJLEdBQUcsSUFBSSxtQkFBSixDQUFjLE1BQU0sQ0FBQyxTQUFQLENBQWlCLEtBQWpCLENBQXVCLE9BQXJDLENBQWI7QUFDQSxTQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsUUFBZixDQUF3QixJQUFJLENBQUMsTUFBN0I7QUFDQSxRQUFJLENBQUMsY0FBTCxDQUFvQixHQUFwQjtBQUVBLFVBQU0sWUFBWSxHQUFzQixJQUFJLHFDQUFKLENBQXNCLEtBQUssbUJBQUwsRUFBdEIsQ0FBeEM7QUFDQSxTQUFLLEdBQUwsQ0FBUyxLQUFULENBQWUsUUFBZixDQUF3QixZQUF4QixFQVBHLENBU0g7O0FBQ0EsU0FBSyxHQUFMLENBQVMsTUFBVCxDQUFnQixHQUFoQixDQUFvQixNQUFLO0FBQ3ZCLGtCQUFZLENBQUMsQ0FBYixJQUFrQixJQUFsQjs7QUFDQSxVQUFJLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBWixJQUFpQixLQUFLLEdBQUwsQ0FBUyxJQUFULENBQWMsS0FBbkMsRUFBMEM7QUFDeEMsWUFBSSxDQUFDLFNBQUwsR0FBaUIsTUFBakI7QUFDRCxPQUZELE1BRU8sSUFBSSxJQUFJLENBQUMsTUFBTCxDQUFZLENBQVosR0FBZ0IsQ0FBcEIsRUFBdUI7QUFDNUIsWUFBSSxDQUFDLFNBQUwsR0FBaUIsT0FBakI7QUFDRDs7QUFDRCxVQUFJLENBQUMsSUFBTDtBQUNELEtBUkQ7QUFTRDs7QUFuRU8sQyxDQXNFVjs7O0FBQ0EsSUFBSSxJQUFKIiwiZmlsZSI6Ii4vdHMtb3V0L2FwcC5qcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xyXG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xyXG59O1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbmNvbnN0IHBpeGlfanNfMSA9IHJlcXVpcmUoXCJwaXhpLmpzXCIpO1xyXG5jb25zdCBDaGFyYWN0ZXJfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiLi9hcHAvQ2hhcmFjdGVyXCIpKTtcclxuY29uc3QgTm9kZUdyYXBoUmVuZGVyZXJfMSA9IHJlcXVpcmUoXCIuL05vZGVSZW5kZXJlclBpeGlqcy9Ob2RlR3JhcGhSZW5kZXJlclwiKTtcclxuY29uc3QgTm9kZUNvcmVfMSA9IHJlcXVpcmUoXCIuL05vZGVTeXN0ZW0vTm9kZUNvcmVcIik7XHJcbmNvbnN0IEFkZE5vZGVfMSA9IHJlcXVpcmUoXCIuL05vZGVTeXN0ZW0vTm9kZXMvQWRkTm9kZVwiKTtcclxuY29uc3QgQ29uc3RhbnROdW1iZXJOb2RlXzEgPSByZXF1aXJlKFwiLi9Ob2RlU3lzdGVtL05vZGVzL0NvbnN0YW50TnVtYmVyTm9kZVwiKTtcclxuY29uc3QgTXVsdGlwbHlOb2RlXzEgPSByZXF1aXJlKFwiLi9Ob2RlU3lzdGVtL05vZGVzL011bHRpcGx5Tm9kZVwiKTtcclxuY29uc3QgbG9hZGVyID0gcGl4aV9qc18xLkxvYWRlci5zaGFyZWQ7XHJcbmNsYXNzIEdhbWUge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgLy8gaW5zdGFudGlhdGUgYXBwXHJcbiAgICAgICAgdGhpcy5hcHAgPSBuZXcgcGl4aV9qc18xLkFwcGxpY2F0aW9uKHtcclxuICAgICAgICAgICAgd2lkdGg6IDUxMixcclxuICAgICAgICAgICAgaGVpZ2h0OiA1MTIsXHJcbiAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogMHgxMDk5YmIsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy8gY3JlYXRlIHZpZXcgaW4gRE9NXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmFwcC52aWV3KTtcclxuICAgICAgICAvLyBwcmVsb2FkIG5lZWRlZCBhc3NldHNcclxuICAgICAgICBsb2FkZXIuYWRkKCdzYW1pcicsICcvYXNzZXRzL2ltZy9oZXJvLnBuZycpO1xyXG4gICAgICAgIC8vIHRoZW4gbGF1bmNoIGFwcCBvbiBsb2FkZXIgcmVhZHlcclxuICAgICAgICBsb2FkZXIubG9hZCh0aGlzLnNldHVwLmJpbmQodGhpcykpO1xyXG4gICAgfVxyXG4gICAgLy9ERUJVRyBGVU5DVElPTlxyXG4gICAgZ2VuZXJhdGVfdGVzdF9ncmFwaCgpIHtcclxuICAgICAgICBsZXQgR3JhcGggPSBuZXcgTm9kZUNvcmVfMS5Ob2RlR3JhcGgoKTtcclxuICAgICAgICB2YXIgY24xID0gbmV3IENvbnN0YW50TnVtYmVyTm9kZV8xLkNvbnN0YW50TnVtYmVyTm9kZSgyLjUpO1xyXG4gICAgICAgIHZhciBjbjIgPSBuZXcgQ29uc3RhbnROdW1iZXJOb2RlXzEuQ29uc3RhbnROdW1iZXJOb2RlKDMuNSk7XHJcbiAgICAgICAgdmFyIGFuID0gbmV3IEFkZE5vZGVfMS5BZGROb2RlKCk7XHJcbiAgICAgICAgdmFyIGNuMyA9IG5ldyBDb25zdGFudE51bWJlck5vZGVfMS5Db25zdGFudE51bWJlck5vZGUoNi41KTtcclxuICAgICAgICB2YXIgYW4yID0gbmV3IE11bHRpcGx5Tm9kZV8xLk11bHRpcGx5Tm9kZSgpO1xyXG4gICAgICAgIEdyYXBoLkFkZE5vZGUoY24xKTtcclxuICAgICAgICBHcmFwaC5BZGROb2RlKGNuMik7XHJcbiAgICAgICAgR3JhcGguQWRkTm9kZShhbik7XHJcbiAgICAgICAgR3JhcGguQWRkTm9kZShjbjMpO1xyXG4gICAgICAgIEdyYXBoLkFkZE5vZGUoYW4yKTtcclxuICAgICAgICBjbjEuQ29ubmVjdCgwLCAwLCBhbik7XHJcbiAgICAgICAgY24yLkNvbm5lY3QoMCwgMSwgYW4pO1xyXG4gICAgICAgIGNuMy5Db25uZWN0KDAsIDAsIGFuMik7XHJcbiAgICAgICAgYW4uQ29ubmVjdCgwLCAxLCBhbjIpO1xyXG4gICAgICAgIC8vYW4yLkV2YWx1YXRlTm9kZSgpO1xyXG4gICAgICAgIEdyYXBoLkV2YWx1YXRlQWxsKCk7XHJcbiAgICAgICAgcmV0dXJuIEdyYXBoO1xyXG4gICAgfVxyXG4gICAgLy9cclxuICAgIHNldHVwKCkge1xyXG4gICAgICAgIC8vIGFwcGVuZCBoZXJvXHJcbiAgICAgICAgY29uc3QgaGVybyA9IG5ldyBDaGFyYWN0ZXJfMS5kZWZhdWx0KGxvYWRlci5yZXNvdXJjZXMuc2FtaXIudGV4dHVyZSk7XHJcbiAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQoaGVyby5zcHJpdGUpO1xyXG4gICAgICAgIGhlcm8uc2V0VG9wUG9zaXRpb24oMjU2KTtcclxuICAgICAgICBjb25zdCBub2RlUmVuZGVyZXIgPSBuZXcgTm9kZUdyYXBoUmVuZGVyZXJfMS5Ob2RlR3JhcGhSZW5kZXJlcih0aGlzLmdlbmVyYXRlX3Rlc3RfZ3JhcGgoKSk7XHJcbiAgICAgICAgdGhpcy5hcHAuc3RhZ2UuYWRkQ2hpbGQobm9kZVJlbmRlcmVyKTtcclxuICAgICAgICAvLyAgYW5pbWF0ZSBoZXJvXHJcbiAgICAgICAgdGhpcy5hcHAudGlja2VyLmFkZCgoKSA9PiB7XHJcbiAgICAgICAgICAgIG5vZGVSZW5kZXJlci54ICs9IDAuMDU7XHJcbiAgICAgICAgICAgIGlmIChoZXJvLnNwcml0ZS54ID49IHRoaXMuYXBwLnZpZXcud2lkdGgpIHtcclxuICAgICAgICAgICAgICAgIGhlcm8uZGlyZWN0aW9uID0gJ2xlZnQnO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKGhlcm8uc3ByaXRlLnggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBoZXJvLmRpcmVjdGlvbiA9ICdyaWdodCc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaGVyby5tb3ZlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ld1xyXG5uZXcgR2FtZSgpO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./ts-out/app.js\n");

/***/ }),

/***/ "./ts-out/app/Character.js":
/*!*********************************!*\
  !*** ./ts-out/app/Character.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nconst pixi_js_1 = __webpack_require__(/*! pixi.js */ \"pixi.js\");\n\nconst loader = pixi_js_1.Loader.shared;\n\nclass Character {\n  constructor(texture) {\n    this.texture = texture;\n    this.speed = 2;\n    this.direction = 'right';\n    this.sprite = new pixi_js_1.Sprite(loader.resources.samir.texture);\n    this.sprite.anchor.y = 0.5;\n    this.sprite.anchor.x = 0.5;\n  }\n\n  setTopPosition(y) {\n    this.sprite.y = y;\n  }\n\n  move() {\n    if (this.direction === 'right') {\n      this.sprite.x += this.speed;\n    } else {\n      this.sprite.x -= this.speed;\n    }\n  }\n\n}\n\nexports.default = Character;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi4vLi4vc3JjL2FwcC9DaGFyYWN0ZXIudHM/YzMxOSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFFQSxNQUFNLE1BQU0sR0FBRyxpQkFBTyxNQUF0Qjs7QUFFQSxNQUFxQixTQUFyQixDQUE4QjtBQU81QixjQUFtQixPQUFuQixFQUFtQztBQUFoQjtBQUpuQixpQkFBUSxDQUFSO0FBRUEscUJBQThCLE9BQTlCO0FBR0UsU0FBSyxNQUFMLEdBQWMsSUFBSSxnQkFBSixDQUFXLE1BQU0sQ0FBQyxTQUFQLENBQWlCLEtBQWpCLENBQXVCLE9BQWxDLENBQWQ7QUFDQSxTQUFLLE1BQUwsQ0FBWSxNQUFaLENBQW1CLENBQW5CLEdBQXVCLEdBQXZCO0FBQ0EsU0FBSyxNQUFMLENBQVksTUFBWixDQUFtQixDQUFuQixHQUF1QixHQUF2QjtBQUNEOztBQUVELGdCQUFjLENBQUMsQ0FBRCxFQUFVO0FBQ3RCLFNBQUssTUFBTCxDQUFZLENBQVosR0FBZ0IsQ0FBaEI7QUFDRDs7QUFFRCxNQUFJO0FBQ0YsUUFBSSxLQUFLLFNBQUwsS0FBbUIsT0FBdkIsRUFBZ0M7QUFDOUIsV0FBSyxNQUFMLENBQVksQ0FBWixJQUFpQixLQUFLLEtBQXRCO0FBQ0QsS0FGRCxNQUVPO0FBQ0wsV0FBSyxNQUFMLENBQVksQ0FBWixJQUFpQixLQUFLLEtBQXRCO0FBQ0Q7QUFDRjs7QUF2QjJCOztBQUE5QiIsImZpbGUiOiIuL3RzLW91dC9hcHAvQ2hhcmFjdGVyLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XHJcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcclxuY29uc3QgcGl4aV9qc18xID0gcmVxdWlyZShcInBpeGkuanNcIik7XHJcbmNvbnN0IGxvYWRlciA9IHBpeGlfanNfMS5Mb2FkZXIuc2hhcmVkO1xyXG5jbGFzcyBDaGFyYWN0ZXIge1xyXG4gICAgY29uc3RydWN0b3IodGV4dHVyZSkge1xyXG4gICAgICAgIHRoaXMudGV4dHVyZSA9IHRleHR1cmU7XHJcbiAgICAgICAgdGhpcy5zcGVlZCA9IDI7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSAncmlnaHQnO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlID0gbmV3IHBpeGlfanNfMS5TcHJpdGUobG9hZGVyLnJlc291cmNlcy5zYW1pci50ZXh0dXJlKTtcclxuICAgICAgICB0aGlzLnNwcml0ZS5hbmNob3IueSA9IDAuNTtcclxuICAgICAgICB0aGlzLnNwcml0ZS5hbmNob3IueCA9IDAuNTtcclxuICAgIH1cclxuICAgIHNldFRvcFBvc2l0aW9uKHkpIHtcclxuICAgICAgICB0aGlzLnNwcml0ZS55ID0geTtcclxuICAgIH1cclxuICAgIG1vdmUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAncmlnaHQnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnggKz0gdGhpcy5zcGVlZDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlLnggLT0gdGhpcy5zcGVlZDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0cy5kZWZhdWx0ID0gQ2hhcmFjdGVyO1xyXG4vLyMgc291cmNlTWFwcGluZ1VSTD1DaGFyYWN0ZXIuanMubWFwIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./ts-out/app/Character.js\n");

/***/ }),

/***/ 0:
/*!********************************************************************************************!*\
  !*** multi ./node_modules/electron-webpack/out/electron-main-hmr/main-hmr ./ts-out/app.js ***!
  \********************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! E:\Projecten\NodeCore-pixi-frontend\node_modules\electron-webpack\out\electron-main-hmr\main-hmr */"./node_modules/electron-webpack/out/electron-main-hmr/main-hmr.js");
module.exports = __webpack_require__(/*! E:\Projecten\NodeCore-pixi-frontend\ts-out\app.js */"./ts-out/app.js");


/***/ }),

/***/ "electron-webpack/out/electron-main-hmr/HmrClient":
/*!*******************************************************************!*\
  !*** external "electron-webpack/out/electron-main-hmr/HmrClient" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"electron-webpack/out/electron-main-hmr/HmrClient\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJlbGVjdHJvbi13ZWJwYWNrL291dC9lbGVjdHJvbi1tYWluLWhtci9IbXJDbGllbnRcIj9kZTY3Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6ImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImVsZWN0cm9uLXdlYnBhY2svb3V0L2VsZWN0cm9uLW1haW4taG1yL0htckNsaWVudFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///electron-webpack/out/electron-main-hmr/HmrClient\n");

/***/ }),

/***/ "pixi.js":
/*!**************************!*\
  !*** external "pixi.js" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"pixi.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwaXhpLmpzXCI/ZWI5YiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwaXhpLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGl4aS5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///pixi.js\n");

/***/ }),

/***/ "source-map-support/source-map-support.js":
/*!***********************************************************!*\
  !*** external "source-map-support/source-map-support.js" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"source-map-support/source-map-support.js\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzXCI/OWM1ZiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJzb3VyY2UtbWFwLXN1cHBvcnQvc291cmNlLW1hcC1zdXBwb3J0LmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic291cmNlLW1hcC1zdXBwb3J0L3NvdXJjZS1tYXAtc3VwcG9ydC5qc1wiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///source-map-support/source-map-support.js\n");

/***/ })

/******/ });
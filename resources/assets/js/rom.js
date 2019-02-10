const SparkMD5 = require('spark-md5');
const FileSaver = require('file-saver');

var ROM = (function(blob, loaded_callback, error_callback) {
	var u_array = [];
	var arrayBuffer;
	var base_patch;
	var original_data;
	var size = 2; // mb

	var music = {
		0x00:[0xD373B,0xD375B,0xD90F8],
		0x14:[0xDA710,0xDA7A4,0xDA7BB,0xDA7D2],
		0x3C:[0xD5954,0xD653B,0xDA736,0xDA752,0xDA772,0xDA792],
		0x50:[0xD5B47,0xD5B5E],
		0x5A:[0xD4306],
		0x64:[0xD6878,0xD6883,0xD6E48,0xD6E76,0xD6EFB,0xD6F2D,0xDA211,0xDA35B,0xDA37B,0xDA38E,
			0xDA39F,0xDA5C3,0xDA691,0xDA6A8,0xDA6DF],
		0x78:[0xD2349,0xD3F45,0xD42EB,0xD48B9,0xD48FF,0xD543F,0xD5817,0xD5957,0xD5ACB,0xD5AE8,
			0xD5B4A,0xDA5DE,0xDA608,0xDA635,0xDA662,0xDA71F,0xDA7AF,0xDA7C6,0xDA7DD],
		0x82:[0xD2F00,0xDA3D5],
		0xA0:[0xD249C,0xD24CD,0xD2C09,0xD2C53,0xD2CAF,0xD2CEB,0xD2D91,0xD2EE6,0xD38ED,0xD3C91,
			0xD3CD3,0xD3CE8,0xD3F0C,0xD3F82,0xD405F,0xD4139,0xD4198,0xD41D5,0xD41F6,0xD422B,0xD4270,
			0xD42B1,0xD4334,0xD4371,0xD43A6,0xD43DB,0xD441E,0xD4597,0xD4B3C,0xD4BAB,0xD4C03,0xD4C53,
			0xD4C7F,0xD4D9C,0xD5424,0xD65D2,0xD664F,0xD6698,0xD66FF,0xD6985,0xD6C5C,0xD6C6F,0xD6C8E,
			0xD6CB4,0xD6D7D,0xD827D,0xD960C,0xD9828,0xDA233,0xDA3A2,0xDA49E,0xDA72B,0xDA745,0xDA765,
			0xDA785,0xDABF6,0xDAC0D,0xDAEBE,0xDAFAC],
		0xAA:[0xD9A02,0xD9BD6],
		0xB4:[0xD21CD,0xD2279,0xD2E66,0xD2E70,0xD2EAB,0xD3B97,0xD3BAC,0xD3BE8,0xD3C0D,0xD3C39,
			0xD3C68,0xD3C9F,0xD3CBC,0xD401E,0xD4290,0xD443E,0xD456F,0xD47D3,0xD4D43,0xD4DCC,0xD4EBA,
			0xD4F0B,0xD4FE5,0xD5012,0xD54BC,0xD54D5,0xD54F0,0xD5509,0xD57D8,0xD59B9,0xD5A2F,0xD5AEB,
			0xD5E5E,0xD5FE9,0xD658F,0xD674A,0xD6827,0xD69D6,0xD69F5,0xD6A05,0xD6AE9,0xD6DCF,0xD6E20,
			0xD6ECB,0xD71D4,0xD71E6,0xD7203,0xD721E,0xD8724,0xD8732,0xD9652,0xD9698,0xD9CBC,0xD9DC0,
			0xD9E49,0xDAA68,0xDAA77,0xDAA88,0xDAA99,0xDAF04],
		0x8C:[0xD1D28,0xD1D41,0xD1D5C,0xD1D77,0xD1EEE,0xD311D,0xD31D1,0xD4148,0xD5543,0xD5B6F,
			0xD65B3,0xD6760,0xD6B6B,0xD6DF6,0xD6E0D,0xD73A1,0xD814C,0xD825D,0xD82BE,0xD8340,0xD8394,
			0xD842C,0xD8796,0xD8903,0xD892A,0xD91E8,0xD922B,0xD92E0,0xD937E,0xD93C1,0xDA958,0xDA971,
			0xDA98C,0xDA9A7],
		0xC8:[0xD1D92,0xD1DBD,0xD1DEB,0xD1F5D,0xD1F9F,0xD1FBD,0xD1FDC,0xD1FEA,0xD20CA,0xD21BB,
			0xD22C9,0xD2754,0xD284C,0xD2866,0xD2887,0xD28A0,0xD28BA,0xD28DB,0xD28F4,0xD293E,0xD2BF3,
			0xD2C1F,0xD2C69,0xD2CA1,0xD2CC5,0xD2D05,0xD2D73,0xD2DAF,0xD2E3D,0xD2F36,0xD2F46,0xD2F6F,
			0xD2FCF,0xD2FDF,0xD302B,0xD3086,0xD3099,0xD30A5,0xD30CD,0xD30F6,0xD3154,0xD3184,0xD333A,
			0xD33D9,0xD349F,0xD354A,0xD35E5,0xD3624,0xD363C,0xD3672,0xD3691,0xD36B4,0xD36C6,0xD3724,
			0xD3767,0xD38CB,0xD3B1D,0xD3B2F,0xD3B55,0xD3B70,0xD3B81,0xD3BBF,0xD3F65,0xD3FA6,0xD404F,
			0xD4087,0xD417A,0xD41A0,0xD425C,0xD4319,0xD433C,0xD43EF,0xD440C,0xD4452,0xD4494,0xD44B5,
			0xD4512,0xD45D1,0xD45EF,0xD4682,0xD46C3,0xD483C,0xD4848,0xD4855,0xD4862,0xD486F,0xD487C,
			0xD4A1C,0xD4A3B,0xD4A60,0xD4B27,0xD4C7A,0xD4D12,0xD4D81,0xD4E90,0xD4ED6,0xD4EE2,0xD5005,
			0xD502E,0xD503C,0xD5081,0xD51B1,0xD51C7,0xD51CF,0xD51EF,0xD520C,0xD5214,0xD5231,0xD5257,
			0xD526D,0xD5275,0xD52AF,0xD52BD,0xD52CD,0xD52DB,0xD549C,0xD5801,0xD58A4,0xD5A68,0xD5A7F,
			0xD5C12,0xD5D71,0xD5E10,0xD5E9A,0xD5F8B,0xD5FA4,0xD651A,0xD6542,0xD65ED,0xD661D,0xD66D7,
			0xD6776,0xD68BD,0xD68E5,0xD6956,0xD6973,0xD69A8,0xD6A51,0xD6A86,0xD6B96,0xD6C3E,0xD6D4A,
			0xD6E9C,0xD6F80,0xD717E,0xD7190,0xD71B9,0xD811D,0xD8139,0xD816B,0xD818A,0xD819E,0xD81BE,
			0xD829C,0xD82E1,0xD8306,0xD830E,0xD835E,0xD83AB,0xD83CA,0xD83F0,0xD83F8,0xD844B,0xD8479,
			0xD849E,0xD84CB,0xD84EB,0xD84F3,0xD854A,0xD8573,0xD859D,0xD85B4,0xD85CE,0xD862A,0xD8681,
			0xD87E3,0xD87FF,0xD887B,0xD88C6,0xD88E3,0xD8944,0xD897B,0xD8C97,0xD8CA4,0xD8CB3,0xD8CC2,
			0xD8CD1,0xD8D01,0xD917B,0xD918C,0xD919A,0xD91B5,0xD91D0,0xD91DD,0xD9220,0xD9273,0xD9284,
			0xD9292,0xD92AD,0xD92C8,0xD92D5,0xD9311,0xD9322,0xD9330,0xD934B,0xD9366,0xD9373,0xD93B6,
			0xD97A6,0xD97C2,0xD97DC,0xD97FB,0xD9811,0xD98FF,0xD996F,0xD99A8,0xD99D5,0xD9A30,0xD9A4E,
			0xD9A6B,0xD9A88,0xD9AF7,0xD9B1D,0xD9B43,0xD9B7C,0xD9BA9,0xD9C84,0xD9C8D,0xD9CAC,0xD9CE8,
			0xD9CF3,0xD9CFD,0xD9D46,0xDA35E,0xDA37E,0xDA391,0xDA478,0xDA4C3,0xDA4D7,0xDA4F6,0xDA515,
			0xDA6E2,0xDA9C2,0xDA9ED,0xDAA1B,0xDAA57,0xDABAF,0xDABC9,0xDABE2,0xDAC28,0xDAC46,0xDAC63,
			0xDACB8,0xDACEC,0xDAD08,0xDAD25,0xDAD42,0xDAD5F,0xDAE17,0xDAE34,0xDAE51,0xDAF2E,0xDAF55,
			0xDAF6B,0xDAF81,0xDB14F,0xDB16B,0xDB180,0xDB195,0xDB1AA],
		0xD2:[0xD2B88,0xD364A,0xD369F,0xD3747],
		0xDC:[0xD213F,0xD2174,0xD229E,0xD2426,0xD4731,0xD4753,0xD4774,0xD4795,0xD47B6,0xD4AA5,
			0xD4AE4,0xD4B96,0xD4CA5,0xD5477,0xD5A3D,0xD6566,0xD672C,0xD67C0,0xD69B8,0xD6AB1,0xD6C05,
			0xD6DB3,0xD71AB,0xD8E2D,0xD8F0D,0xD94E0,0xD9544,0xD95A8,0xD9982,0xD9B56,0xDA694,0xDA6AB,
			0xDAE88,0xDAEC8,0xDAEE6,0xDB1BF],
		0xE6:[0xD210A,0xD22DC,0xD2447,0xD5A4D,0xD5DDC,0xDA251,0xDA26C],
		0xF0:[0xD945E,0xD967D,0xD96C2,0xD9C95,0xD9EE6,0xDA5C6],
		0xFA:[0xD2047,0xD24C2,0xD24EC,0xD25A4,0xD51A8,0xD51E6,0xD524E,0xD529E,0xD6045,0xD81DE,
			0xD821E,0xD94AA,0xD9A9E,0xD9AE4,0xDA289],
		0xFF:[0xD2085,0xD21C5,0xD5F28]
	};

	var fileReader = new FileReader();

	fileReader.onload = function() {
		arrayBuffer = this.result;
	};

	fileReader.onloadend = function() {
		if (typeof arrayBuffer === 'undefined') {
			if (error_callback) error_callback();
			return;
		}
		// Check rom for header and cut it out
		if (arrayBuffer.byteLength % 0x400 == 0x200) {
			arrayBuffer = arrayBuffer.slice(0x200, arrayBuffer.byteLength);
		}

		original_data = arrayBuffer.slice(0);
		this.resize(size);

		u_array = new Uint8Array(arrayBuffer);

		if (loaded_callback) loaded_callback(this);
	}.bind(this);

	fileReader.readAsArrayBuffer(blob);

	this.checkMD5 = function() {
		return SparkMD5.ArrayBuffer.hash(arrayBuffer);
	};

	this.getArrayBuffer = function() {
		return arrayBuffer;
	};

	this.getOriginalArrayBuffer = function() {
		return original_data;
	};

	this.write = function(seek, bytes) {
		if (!Array.isArray(bytes)) {
			u_array[seek] = bytes;
			return;
		}
		for (var i = 0; i < bytes.length; i++) {
			u_array[seek + i] = bytes[i];
		}
	};

	this.updateChecksum = function() {
		return new Promise(function(resolve, reject) {
			var sum = u_array.reduce(function(sum, mbyte, i) {
				if (i >= 0x7FDC && i < 0x7FE0) {
					return sum;
				}
				return sum + mbyte;
			});
			var checksum = (sum + 0x1FE) & 0xFFFF;
			var inverse = checksum ^ 0xFFFF;
			this.write(0x7FDC, [inverse & 0xFF, inverse >> 8, checksum & 0xFF, checksum >> 8]);
			resolve(this);
		}.bind(this));
	}.bind(this);

	this.save = function(filename) {
		this.updateChecksum().then(function() {
			FileSaver.saveAs(new Blob([u_array]), filename);
		});
	};

	this.parseSprGfx = function(spr) {
		if ('ZSPR' == String.fromCharCode(spr[0]) + String.fromCharCode(spr[1]) + String.fromCharCode(spr[2]) + String.fromCharCode(spr[3])) {
			return this.parseZsprGfx(spr);
		}
		return new Promise(function(resolve, reject) {
			for (var i = 0; i < 0x7000; i++) {
				u_array[0x80000 + i] = spr[i];
			}
			for (var i = 0; i < 120; i++) {
				u_array[0xDD308 + i] = spr[0x7000 + i];
			}
			// gloves color
			u_array[0xDEDF5] = spr[0x7036];
			u_array[0xDEDF6] = spr[0x7037];
			u_array[0xDEDF7] = spr[0x7054];
			u_array[0xDEDF8] = spr[0x7055];
			resolve(this);
		}.bind(this));
	}.bind(this);

	this.parseZsprGfx = function(zspr) {
		// we are going to just hope that it's in the proper format O.o
		return new Promise(function(resolve, reject) {
			var gfx_offset =  zspr[12] << 24 | zspr[11] << 16 | zspr[10] << 8 | zspr[9];
			var palette_offset = zspr[18] << 24 | zspr[17] << 16 | zspr[16] << 8 | zspr[15];
			// GFX
			for (var i = 0; i < 0x7000; i++) {
				u_array[0x80000 + i] = zspr[gfx_offset + i];
			}
			// Palettes
			for (var i = 0; i < 120; i++) {
				u_array[0xDD308 + i] = zspr[palette_offset + i];
			}
			// Gloves
			for (var i = 0; i < 4; ++i) {
				u_array[0xDEDF5 + i] = zspr[palette_offset + 120 + i];
			}
			resolve(this);
		}.bind(this));
	}.bind(this);

	this.setQuickswap = function(enable) {
		return new Promise(function(resolve, reject) {
			this.write(0x18004B, enable ? 0x01 : 0x00);
			resolve(this);
		}.bind(this));
	}.bind(this);

	this.setMusicVolume = function(enable) {
		return new Promise(function(resolve, reject) {
			for (volume in music) {
				for (var i = 0; i < music[volume].length; i++) {
					u_array[music[volume][i]] = enable ? volume : 0;
				}
			}
			resolve(this);
		}.bind(this));
	}.bind(this);

	this.setMenuSpeed = function(speed) {
		return new Promise(function(resolve, reject) {
			var fast = false;
			switch (speed) {
				case 'instant':
				this.write(0x180048, 0xE8);
					fast = true;
					break;
				case 'fast':
				this.write(0x180048, 0x10);
					break;
				case 'normal':
				default:
				this.write(0x180048, 0x08);
					break;
				case 'slow':
				this.write(0x180048, 0x04);
					break;
			}
			this.write(0x6DD9A, fast ? 0x20 : 0x11);
			this.write(0x6DF2A, fast ? 0x20 : 0x12);
			this.write(0x6E0E9, fast ? 0x20 : 0x12);
			resolve(this);
		}.bind(this));
	}.bind(this);

	this.setHeartColor = function(color_on) {
		return new Promise(function(resolve, reject) {
			switch (color_on) {
				case 'blue':
					byte = 0x2C;
					file_byte = 0x0D;
					break;
				case 'green':
					byte = 0x3C;
					file_byte = 0x19;
					break;
				case 'yellow':
					byte = 0x28;
					file_byte = 0x09;
					break;
				case 'red':
				default:
					byte = 0x24;
					file_byte = 0x05;
			}
			this.write(0x6FA1E, byte);
			this.write(0x6FA20, byte);
			this.write(0x6FA22, byte);
			this.write(0x6FA24, byte);
			this.write(0x6FA26, byte);
			this.write(0x6FA28, byte);
			this.write(0x6FA2A, byte);
			this.write(0x6FA2C, byte);
			this.write(0x6FA2E, byte);
			this.write(0x6FA30, byte);
			this.write(0x65561, file_byte);
			resolve(this);
		}.bind(this));
	}.bind(this);

	this.setHeartSpeed = function(speed) {
		return new Promise(function(resolve, reject) {
			var sbyte = 0x20;
			switch (speed) {
				case 'off': sbyte = 0x00; break;
				case 'half': sbyte = 0x40; break;
				case 'quarter': sbyte = 0x80; break;
				case 'double': sbyte = 0x10; break;
			}
			this.write(0x180033, sbyte);
			resolve(this);
		}.bind(this));
	}.bind(this);

	this.parsePatch = function(data, progressCallback) {
		return new Promise(function(resolve, reject) {
			this.difficulty = data.difficulty;
			this.seed = data.seed;
			this.spoiler = data.spoiler;
			this.hash = data.hash;
			this.generated = data.generated;
			if (data.size) {
				this.resize(data.size);
			}
			if (data.spoiler && data.spoiler.meta) {
				this.build = data.spoiler.meta.build;
				this.goal = data.spoiler.meta.goal;
				this.logic = data.spoiler.meta.logic;
				this.mode = data.spoiler.meta.mode;
				this.name = data.spoiler.meta.name;
				this.variation = data.spoiler.meta.variation;
				this.weapons = data.spoiler.meta.weapons;
				this.shuffle = data.spoiler.meta.shuffle;
				this.difficulty_mode = data.spoiler.meta.difficulty_mode;
				this.notes = data.spoiler.meta.notes;
				this.tournament = data.spoiler.meta.tournament;
				this.special = data.spoiler.meta.special;
			}
			if (data.patch && data.patch.length) {
				data.patch.forEach(function(value, index, array) {
					if (progressCallback) progressCallback(index / data.patch.length, this);
					for (address in value) {
						this.write(Number(address), value[address]);
					}
				}.bind(this));
			}
			resolve(this);
		}.bind(this));
	};

	this.setBasePatch = function(patch) {
		this.base_patch = patch;
	};

	this.resizeUint8 = function(baseArrayBuffer, newByteSize) {
		var resizedArrayBuffer = new ArrayBuffer(newByteSize),
			len = baseArrayBuffer.byteLength,
			resizeLen = (len > newByteSize)? newByteSize : len;

		(new Uint8Array(resizedArrayBuffer, 0, resizeLen)).set(new Uint8Array(baseArrayBuffer, 0, resizeLen));

		return resizedArrayBuffer;
	};

	this.resize = function(size) {
		switch (size) {
			case 4:
				arrayBuffer = this.resizeUint8(arrayBuffer, 4194304);
				break;
			case 2:
				arrayBuffer = this.resizeUint8(arrayBuffer, 2097152);
				break;
			case 1:
			default:
				size = 1;
				arrayBuffer = this.resizeUint8(arrayBuffer, 1048576);
		}
		u_array = new Uint8Array(arrayBuffer);
		this.size = size;
	};

	this.downloadFilename = function() {
		return this.name
			|| 'ALttP - VT_' + this.logic
			+ '_' + this.difficulty
			+ '-' + this.mode
			+ (this.weapons ? '_' + this.weapons : '')
			+ '-' + this.goal
			+ (this.variation == 'none' ? '' : '_' + this.variation)
			+ '_' + this.hash
			+ (this.special ? '_special' : '');
	};

	this.reset = function(size) {
		return new Promise((resolve, reject) => {
			arrayBuffer = original_data.slice(0);
			// always reset to 2mb so we can verify MD5 later
			this.resize(2);

			if (!this.base_patch) {
				reject('base patch not set');
			}
			this.parsePatch({patch: this.base_patch}).then((rom) => {
				resolve(rom);
			}).catch((error) => {
				console.log(error, ":(");
				reject('sadness');
			});
		});
	};
});

module.exports = ROM;

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'password' => ['required', 'string', 'min:10', 'confirmed'],
        ]);
        if (User::where('email', $data['email'])->exists()) {
            throw ValidationException::withMessages(['email' => 'This email is already registered.']);
        }

        // Public registration always creates a customer; never accept role from client.
        $user = User::create([
            'name' => $data['name'],
            'email' => strtolower($data['email']),
            'password' => Hash::make($data['password']),
            'role' => 'customer',
        ]);
        return response()->json(['message' => 'Account created.', 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $data = $request->validate(['email' => ['required', 'email'], 'password' => ['required', 'string']]);
        $user = User::where('email', strtolower($data['email']))->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => 'Invalid email or password.']);
        }

        // Configure Sanctum or another token package compatible with your MongoDB setup.
        // This call assumes a compatible HasApiTokens trait is installed/configured.
        if (!method_exists($user, 'createToken')) {
            return response()->json(['message' => 'API token support is not configured for this MongoDB user model. Follow README setup notes.'], 501);
        }
        $token = $user->createToken('web-client')->plainTextToken;
        return response()->json(['token' => $token, 'user' => ['id' => (string) $user->_id, 'name' => $user->name, 'email' => $user->email, 'role' => $user->role]]);
    }

    public function logout(Request $request)
    {
        $token = $request->user()?->currentAccessToken();
        if ($token && method_exists($token, 'delete')) $token->delete();
        return response()->json(['message' => 'Logged out.']);
    }

    public function profile(Request $request)
    {
        $u = $request->user();
        return response()->json(['id' => (string) $u->_id, 'name' => $u->name, 'email' => $u->email, 'role' => $u->role]);
    }
}
